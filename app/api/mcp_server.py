#!/usr/bin/env python3
"""Vocast 로컬 MCP 서버 — 앱 계층 진입점.

Claude·Codex 등 MCP 지원 AI 에이전트가 이 앱의 기능을 대화로 직접 조작한다.
core/ 의 순수 로직과 api/ 의 저장소·프로필을 재사용한다 (동기 호출).

실행: python app/api/mcp_server.py   (stdio JSON-RPC)
에이전트 등록(설정 출력): python app/api/mcp_server.py --config
"""
import os
import sys
import tempfile
import uuid

# app/ (core·api·voice 패키지의 부모)를 경로에 추가 — standalone 실행 지원
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from mcp.server.fastmcp import FastMCP  # noqa: E402

mcp = FastMCP("vocast")


@mcp.tool()
def health() -> dict:
    """사용 가능한 기능과 엔진 상태를 반환한다.

    clone(보이스 클로닝)은 Apple Silicon에서만 True. denoise는 어디서나 가능.
    """
    import platform

    from core.clone import clone_available
    from core.denoise import dfn_available, resynth_available
    return {
        "denoise": True,
        "denoise_engine": "dfn-hybrid" if dfn_available() else "rnnoise",
        "resynth": resynth_available(),
        "clone": clone_available(),
        "platform": platform.system(),
        "apple_silicon": platform.system() == "Darwin"
        and platform.machine() == "arm64",
    }


@mcp.tool()
def denoise(input_path: str, output_path: str = "", mode: str = "standard",
            boost: float = 0.0) -> dict:
    """영상·음성 파일의 배경 소음을 제거한다. 원본은 수정하지 않는다.

    Args:
        input_path: 처리할 파일 경로 (mov/mp4/wav/m4a/mp3 등).
        output_path: 결과 경로 (비우면 <원본>_clean.<확장자>).
        mode: "standard"(필터, 빠름·목소리 원본 유지) 또는
              "resynth"(생성형 재합성, 발화 중 노이즈까지 제거·느림).
        boost: 볼륨 증폭 dB (0=그대로).
    Returns:
        output_path와 품질 리포트(발화 손실%·무음 억제dB, 재합성은 목소리 유사도).
    """
    from core.media.audio import default_output_ext
    from core.denoise import (denoise_report, resynth_available, run_denoise,
                              voice_similarity)
    if not os.path.exists(input_path):
        raise ValueError(f"파일이 없습니다: {input_path}")
    if mode not in ("standard", "resynth"):
        raise ValueError("mode는 standard 또는 resynth")
    if mode == "resynth" and not resynth_available():
        raise ValueError("재합성 엔진 미설치: bash packaging/scripts/install_resynth.sh")
    name, ext = os.path.splitext(input_path)
    out = output_path or f"{name}_clean{default_output_ext(ext.lower())}"
    run_denoise(input_path, out, boost=boost, mode=mode)
    report = ({"sim": voice_similarity(input_path, out)} if mode == "resynth"
              else denoise_report(input_path, out))
    return {"output_path": out, "mode": mode, "report": report}


@mcp.tool()
def list_voice_profiles() -> list:
    """등록된 보이스 프로필 목록 (id·이름·학습량·버전)."""
    from api.profiles import list_profiles
    return [{"id": p["id"], "name": p.get("name"), "ready": p.get("ready"),
             "version": p.get("version"), "duration": (p.get("stats") or {}).get("duration")}
            for p in list_profiles()]


@mcp.tool()
def clone_voice(text: str, profile_id: str = "", ref_path: str = "",
                output_path: str = "", fast: bool = False) -> dict:
    """텍스트를 지정한 목소리로 낭독한 오디오를 생성한다 (동기 — 수 분 소요).

    profile_id(등록 프로필) 또는 ref_path(목소리 담긴 파일) 중 하나를 준다.
    본인/동의받은 목소리만 사용할 것.

    Args:
        text: 읽어줄 대본 (최대 2만 자).
        profile_id: list_voice_profiles의 id. (또는 ref_path)
        ref_path: 목소리 참조 파일 경로. (또는 profile_id)
        output_path: 결과 wav 경로 (비우면 임시 파일).
        fast: 빠른 모드(1테이크, 품질 낮음).
    Returns:
        output_path와 최종 운율 점수(pns).
    """
    from core.clone import (DEFAULT_TAKES, clone_voice as _clone,
                            clone_available, synthesize_best)
    if not clone_available():
        raise ValueError("보이스 클로닝은 Apple Silicon Mac에서만 지원됩니다.")
    if not text.strip():
        raise ValueError("대본이 비어 있습니다.")
    out = output_path or os.path.join(
        tempfile.gettempdir(), f"clone_{uuid.uuid4().hex[:8]}.wav")
    takes = 1 if fast else DEFAULT_TAKES
    if profile_id:
        from api.profiles import profile_paths
        paths = profile_paths(profile_id)
        if not paths:
            raise ValueError(f"프로필을 찾을 수 없거나 준비 전입니다: {profile_id}")
        _, pns = synthesize_best(text, paths[0], paths[1], paths[2], out,
                                 fast=fast, takes=takes)
    elif ref_path:
        if not os.path.exists(ref_path):
            raise ValueError(f"참조 파일이 없습니다: {ref_path}")
        _clone(ref_path, text, out, fast=fast, takes=takes)
        pns = None
    else:
        raise ValueError("profile_id 또는 ref_path 중 하나가 필요합니다.")
    return {"output_path": out, "pns": pns}


@mcp.tool()
def list_history(limit: int = 10) -> list:
    """최근 생성 작업(클로닝) 기록 (id·제목·상태·점수·문단 수)."""
    from api.profiles import list_history as _hist
    return [{"id": j["id"], "title": j.get("title"), "status": j.get("status"),
             "pns": j.get("pns"), "paragraphs": len(j.get("paragraphs") or [])}
            for j in _hist(limit=limit)]


def _print_config():
    """에이전트(claude_desktop_config.json 등)에 붙일 등록 설정 출력."""
    import json
    py = sys.executable
    here = os.path.abspath(__file__)
    cfg = {"mcpServers": {"vocast": {"command": py, "args": [here]}}}
    print(json.dumps(cfg, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    if "--config" in sys.argv:
        _print_config()
    else:
        mcp.run()
