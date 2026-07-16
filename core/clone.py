"""보이스 클로닝 파이프라인 (Qwen3-TTS, Apple Silicon 전용).

"지표 먼저 → 후보 경쟁 → 최고 선택"으로 확정한 설정:
- 참조 음성은 RNNoise로 전처리 (모든 조합에서 SIM +0.02)
- 기본 모델 1.7B-Base-8bit (SIM 0.917~0.945, CER 0%, MOS 3.50)
- 빠른 모델 0.6B-Base-8bit (SIM 0.921, CER 0%, MOS 3.39)
"""
import importlib.util
import os
import subprocess
import sys
import tempfile

from .denoise import build_audio_filter
from .audio import run_ffmpeg

MODEL_BEST = "mlx-community/Qwen3-TTS-12Hz-1.7B-Base-8bit"
MODEL_FAST = "mlx-community/Qwen3-TTS-12Hz-0.6B-Base-8bit"
WHISPER = "mlx-community/whisper-large-v3-turbo"
MAX_REF_SEC = 15  # 참조는 앞 15초면 충분


def clone_available():
    """이 환경에서 보이스 클로닝을 쓸 수 있는지 (mlx 설치 여부)."""
    return (importlib.util.find_spec("mlx_audio") is not None
            and importlib.util.find_spec("mlx_whisper") is not None)


def prepare_reference(ref_path, workdir, max_sec=MAX_REF_SEC):
    """참조 파일(영상 가능) → (참조 wav, 받아쓰기, 자연 발화 전체 wav).

    ① 전체(최대 2분)를 노이즈 제거 — 이것이 화자의 "자연 운율 기준"이 된다.
    ② 그중 억양이 살아있고 무음 경계에 스냅된 창을 클로닝 참조로 자동 선택
       (운율 의존성 없으면 앞 max_sec 초로 폴백 — 기존 동작).
    """
    full_clean = os.path.join(workdir, "ref_full_clean.wav")
    run_ffmpeg(["-i", ref_path, "-t", "120",
                "-af", build_audio_filter(),
                "-c:a", "pcm_s16le", full_clean])

    clean = os.path.join(workdir, "ref_clean.wav")
    try:
        from .prosody import prosody_deps_available, select_reference_window
        if not prosody_deps_available():
            raise ImportError
        a, b = select_reference_window(full_clean)
        run_ffmpeg(["-ss", f"{a:.2f}", "-t", f"{b - a:.2f}", "-i", full_clean,
                    "-c:a", "pcm_s16le", clean])
    except ImportError:
        run_ffmpeg(["-t", str(max_sec), "-i", full_clean,
                    "-c:a", "pcm_s16le", clean])

    import mlx_whisper
    text = mlx_whisper.transcribe(
        clean, path_or_hf_repo=WHISPER, language="ko")["text"].strip()
    if not text:
        raise RuntimeError("참조 파일에서 말소리를 찾지 못했습니다. "
                           "발화가 또렷한 구간이 필요해요.")
    return clean, text, full_clean


def synthesize(text, ref_wav, ref_text, output_path, fast=False, retries=1,
               timeout_sec=600):
    """참조 목소리로 대본을 읽은 wav 생성.

    저사양(GPU 없는) CI 러너에서 mlx_audio가 파일을 안 만들고 종료코드 0을
    내거나 아예 멈추는 경우가 관찰됨 → 출력 파일 검증 + 타임아웃 + 재시도.
    """
    model = MODEL_FAST if fast else MODEL_BEST
    out_dir = os.path.dirname(os.path.abspath(output_path)) or "."
    prefix = os.path.splitext(os.path.basename(output_path))[0]
    cmd = [sys.executable, "-m", "mlx_audio.tts.generate",
           "--model", model, "--text", text,
           "--ref_audio", ref_wav, "--ref_text", ref_text,
           "--join_audio", "--audio_format", "wav",
           "--output_path", out_dir, "--file_prefix", prefix]
    detail = ""
    for _ in range(1 + retries):
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True,
                                  timeout=timeout_sec)
        except subprocess.TimeoutExpired:
            detail = f"{timeout_sec}초 타임아웃 (생성이 멈춘 것으로 판단)"
            continue
        if proc.returncode == 0 and os.path.exists(output_path):
            return output_path
        detail = (proc.stderr or proc.stdout or "")[-400:]
    raise RuntimeError(f"TTS 생성 실패 (재시도 포함 {1 + retries}회): {detail}")


PNS_TARGET = 82.0  # 운율 북극성 목표 — 이 점수를 넘는 테이크가 나오면 조기 채택


def synthesize_best(text, ref_wav, ref_text, natural_wav, output_path,
                    fast=False, takes=3):
    """best-of-N 테이크: 여러 번 생성해 운율 점수(PNS) 최고 테이크를 채택.

    생성은 확률적이라 테이크 편차가 크다 (실측: 같은 설정으로 50~84점).
    사람 성우가 여러 테이크를 녹음해 고르듯, 북극성 지표로 자동 선별한다.
    PNS_TARGET을 넘으면 조기 종료. 운율 의존성이 없으면 단일 테이크 폴백.
    """
    from .prosody import prosody_deps_available
    if takes <= 1 or not prosody_deps_available():
        return synthesize(text, ref_wav, ref_text, output_path, fast=fast), None

    from .prosody import evaluate_prosody
    best_pns, best_path = -1.0, None
    with tempfile.TemporaryDirectory() as wd:
        for i in range(takes):
            take = os.path.join(wd, f"take_{i}.wav")
            synthesize(text, ref_wav, ref_text, take, fast=fast)
            pns = evaluate_prosody(natural_wav, take)["pns"]
            if pns > best_pns:
                best_pns = pns
                if best_path:
                    os.remove(best_path)
                best_path = take
            else:
                os.remove(take)
            if best_pns >= PNS_TARGET:
                break
        os.replace(best_path, output_path)
    return output_path, best_pns


def clone_voice(ref_path, text, output_path, fast=False, takes=3):
    """참조 파일 + 대본 → 클론 음성. 전체 파이프라인 한 번에. (앱 계층 진입점)"""
    with tempfile.TemporaryDirectory() as wd:
        ref_wav, ref_text, full_clean = prepare_reference(ref_path, wd)
        out, _ = synthesize_best(text, ref_wav, ref_text, full_clean,
                                 output_path, fast=fast, takes=takes)
        return out
