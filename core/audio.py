"""ffmpeg 래퍼 유틸."""
import shutil
import subprocess


def ensure_ffmpeg():
    if not shutil.which("ffmpeg"):
        raise RuntimeError("ffmpeg이 필요합니다. 설치: brew install ffmpeg")


def has_video_stream(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
         "stream=codec_type", "-of", "csv=p=0", path],
        capture_output=True, text=True)
    return "video" in out.stdout


def run_ffmpeg(args):
    """ffmpeg 실행 (에러 출력 캡처). 실패 시 stderr를 담은 RuntimeError."""
    proc = subprocess.run(["ffmpeg", "-y", "-v", "error", *args],
                          capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg 실패: {proc.stderr[-400:]}")


def audio_codec_args(out_ext):
    """출력 확장자에 맞는 오디오 코덱 인자."""
    if out_ext == ".wav":
        return ["-c:a", "pcm_s16le"]
    return ["-c:a", "aac", "-b:a", "192k"]
