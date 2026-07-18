"""ffmpeg 바이너리 리졸버 — 시스템 설치에 의존하지 않기 위한 단일 진입점.

우선순위:
1. 환경변수 NOISECLEANER_FFMPEG (봉인 배포 시 앱 번들이 지정)
2. imageio-ffmpeg 휠에 동봉된 정적 ffmpeg (brew 불필요, 오프라인)
3. 시스템 PATH의 ffmpeg (개발 편의 폴백)

ffprobe는 쓰지 않는다 — imageio-ffmpeg는 ffmpeg만 동봉하므로, 스트림/길이
정보는 `ffmpeg -i`의 stderr를 파싱해 얻는다 (의존 바이너리를 하나로 축소).
"""
import functools
import os
import re
import shutil
import subprocess


@functools.lru_cache(maxsize=1)
def ffmpeg_exe():
    env = os.environ.get("NOISECLEANER_FFMPEG")
    if env and os.path.exists(env):
        return env
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass
    sys_ff = shutil.which("ffmpeg")
    if sys_ff:
        return sys_ff
    raise RuntimeError(
        "ffmpeg을 찾지 못했습니다. `uv pip install imageio-ffmpeg`로 동봉본을 "
        "설치하거나 NOISECLEANER_FFMPEG로 경로를 지정하세요.")


def probe_stderr(path):
    """`ffmpeg -i path`의 stderr 텍스트 (스트림/길이 파싱용). 출력을 안 지정하면
    ffmpeg는 종료코드 1로 정보만 stderr에 찍는다 — 그 텍스트를 그대로 돌려준다."""
    proc = subprocess.run([ffmpeg_exe(), "-hide_banner", "-i", path],
                          capture_output=True, text=True)
    return proc.stderr or ""


_DUR_RE = re.compile(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)")
