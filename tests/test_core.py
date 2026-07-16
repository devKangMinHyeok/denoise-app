"""core 패키지 유닛 테스트 (빠름 — 모델 다운로드 없음).

무거운 통합 테스트(실제 생성·채점)는 quality/run_eval.py 가 담당한다.
"""
import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.denoise import build_audio_filter  # noqa: E402
from core.audio import audio_codec_args  # noqa: E402
from core.metrics import (GATES, SIM_HUMAN_BASELINE, check_gates,  # noqa: E402
                          normalize_ko, voice_clone_score)


# ---- 노이즈 제거 필터 체인 ----

def test_filter_chain_basic():
    af = build_audio_filter()
    assert af.startswith("aformat=channel_layouts=mono")
    assert "arnndn=m=" in af
    assert "volume" not in af


def test_filter_chain_boost():
    assert build_audio_filter(boost=13).endswith(",volume=13dB")


def test_codec_args():
    assert audio_codec_args(".wav") == ["-c:a", "pcm_s16le"]
    assert audio_codec_args(".mov") == ["-c:a", "aac", "-b:a", "192k"]


# ---- CER 정규화 ----

def test_normalize_ko_strips_punct_and_space():
    assert normalize_ko("안녕하세요, 반갑습니다!") == "안녕하세요반갑습니다"


def test_normalize_ko_lowercases_latin():
    assert normalize_ko("AI 도구") == "ai도구"


# ---- 북극성 지표 (VCS) ----

def test_vcs_perfect_score():
    # 본인 육성 기준선 이상 + CER 0 + MOS 5 → 100점
    assert voice_clone_score(SIM_HUMAN_BASELINE, 0.0, 5.0) == pytest.approx(100.0)


def test_vcs_sim_capped_at_baseline():
    # 기준선보다 높은 SIM은 1.0으로 캡 (과최적화 방지)
    assert voice_clone_score(0.99, 0.0, 4.0) == pytest.approx(
        voice_clone_score(SIM_HUMAN_BASELINE, 0.0, 4.0))


def test_vcs_monotonic_in_cer():
    assert voice_clone_score(0.9, 0.0, 3.5) > voice_clone_score(0.9, 10.0, 3.5)


def test_vcs_current_release_level():
    # 확정 설정의 실측치 (SIM 0.917, CER 0, MOS 3.50) → 게이트 통과 수준
    vcs = voice_clone_score(0.917, 0.0, 3.50)
    assert vcs >= GATES["vcs"]


# ---- 게이트 판정 ----

def test_gates_pass():
    ok, failures = check_gates({"sim": 0.92, "cer": 0.0, "mos": 3.5, "vcs": 92.0})
    assert ok and failures == []


def test_gates_fail_lists_reasons():
    ok, failures = check_gates({"sim": 0.50, "cer": 30.0, "mos": 2.0, "vcs": 50.0})
    assert not ok
    assert len(failures) == 4


# ---- 웹 서버 (기능 감지 포함) ----

def test_health_endpoint():
    from web.server import app
    with app.test_client() as c:
        r = c.get("/api/health")
        assert r.status_code == 200
        data = r.get_json()
        assert data["ok"] is True
        assert "clone" in data and "denoise" in data


def test_clone_api_rejects_empty_text():
    from web.server import app
    from core.clone import clone_available
    if not clone_available():
        pytest.skip("mlx 미설치 환경 (501 경로는 별도 테스트)")
    with app.test_client() as c:
        r = c.post("/api/clone", data={})
        assert r.status_code == 400


def test_clone_api_501_when_unavailable(monkeypatch):
    import web.server as srv
    monkeypatch.setattr(srv, "clone_available", lambda: False)
    with srv.app.test_client() as c:
        r = c.post("/api/clone", data={})
        assert r.status_code == 501
