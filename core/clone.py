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
    """참조 파일(영상 가능) → 노이즈 제거된 모노 wav + 받아쓰기 텍스트."""
    clean = os.path.join(workdir, "ref_clean.wav")
    run_ffmpeg(["-i", ref_path, "-t", str(max_sec),
                "-af", build_audio_filter(),
                "-c:a", "pcm_s16le", clean])

    import mlx_whisper
    text = mlx_whisper.transcribe(
        clean, path_or_hf_repo=WHISPER, language="ko")["text"].strip()
    if not text:
        raise RuntimeError("참조 파일에서 말소리를 찾지 못했습니다. "
                           "발화가 또렷한 구간이 필요해요.")
    return clean, text


def synthesize(text, ref_wav, ref_text, output_path, fast=False, retries=1):
    """참조 목소리로 대본을 읽은 wav 생성.

    mlx_audio가 간헐적으로 파일을 안 만들고도 종료코드 0을 내는 경우가 있어
    (저사양 CI 러너에서 관찰됨) 출력 파일 존재를 직접 검증하고 재시도한다.
    """
    model = MODEL_FAST if fast else MODEL_BEST
    out_dir = os.path.dirname(os.path.abspath(output_path)) or "."
    prefix = os.path.splitext(os.path.basename(output_path))[0]
    cmd = [sys.executable, "-m", "mlx_audio.tts.generate",
           "--model", model, "--text", text,
           "--ref_audio", ref_wav, "--ref_text", ref_text,
           "--join_audio", "--audio_format", "wav",
           "--output_path", out_dir, "--file_prefix", prefix]
    proc = None
    for _ in range(1 + retries):
        proc = subprocess.run(cmd, capture_output=True, text=True)
        if proc.returncode == 0 and os.path.exists(output_path):
            return output_path
    detail = (proc.stderr or proc.stdout or "")[-400:]
    raise RuntimeError(f"TTS 생성 실패 (재시도 포함 {1 + retries}회): {detail}")


def clone_voice(ref_path, text, output_path, fast=False):
    """참조 파일 + 대본 → 클론 음성. 전체 파이프라인 한 번에. (앱 계층 진입점)"""
    with tempfile.TemporaryDirectory() as wd:
        ref_wav, ref_text = prepare_reference(ref_path, wd)
        return synthesize(text, ref_wav, ref_text, output_path, fast=fast)
