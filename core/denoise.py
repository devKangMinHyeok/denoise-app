"""배경 소음 제거 파이프라인 (RNNoise).

검증 결과 (DNSMOS P.835 무참조 평가, 11개 후보 경쟁):
SIG 3.60→3.72, BAK 3.97→4.22, OVRL 3.24→3.51, 무음 구간 소음 -21.6dB.
"""
import os

from . import RNNOISE_MODEL
from .audio import audio_codec_args, has_video_stream, run_ffmpeg


def build_audio_filter(boost=0.0, model_path=RNNOISE_MODEL):
    """모노 변환 → RNNoise → (선택) 볼륨 업 필터 체인."""
    af = f"aformat=channel_layouts=mono,arnndn=m='{model_path}'"
    if boost:
        af += f",volume={boost}dB"
    return af


def preprocess_source(input_path, output_path, denoise=True, max_sec=180):
    """프로필 학습 소스 전처리: (선택) 노이즈 제거 + 모노 wav 변환 + 길이 제한.

    영상 파일도 받는다. 소스마다 노이즈 제거를 개별 선택할 수 있게
    변환과 제거를 한 단계로 묶은 헬퍼 (앱 계층은 이 함수만 호출).
    """
    af = build_audio_filter() if denoise else "aformat=channel_layouts=mono"
    args = ["-i", input_path]
    if max_sec:
        args += ["-t", str(max_sec)]
    args += ["-af", af, "-ac", "1", "-c:a", "pcm_s16le", output_path]
    run_ffmpeg(args)
    return output_path


def run_denoise(input_path, output_path, boost=0.0):
    """원본은 건드리지 않고, 소음 제거된 새 파일을 만든다. 영상은 무손실 복사."""
    if os.path.abspath(output_path) == os.path.abspath(input_path):
        raise ValueError("출력이 입력과 같은 파일입니다. 원본 보호를 위해 중단합니다.")
    args = ["-i", input_path]
    if has_video_stream(input_path):
        args += ["-c:v", "copy"]
    args += ["-af", build_audio_filter(boost)]
    args += audio_codec_args(os.path.splitext(output_path)[1].lower())
    args.append(output_path)
    run_ffmpeg(args)
