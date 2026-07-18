"""ffmpeg 바이너리 리졸버 — 시스템 설치에 의존하지 않기 위한 단일 진입점.

우선순위:
1. 환경변수 VOCAST_FFMPEG (봉인 배포 시 앱 번들이 지정)
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
    env = os.environ.get("VOCAST_FFMPEG") or os.environ.get("NOISECLEANER_FFMPEG")
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
        "설치하거나 VOCAST_FFMPEG로 경로를 지정하세요.")


@functools.lru_cache(maxsize=1)
def ensure_ffmpeg_on_path():
    """동봉 ffmpeg를 `ffmpeg`란 이름으로 PATH에 얹는다 (멱등).

    우리 코드는 full path로 부르지만, mlx-whisper 등 제3자 라이브러리는 오디오
    로드에 bare `ffmpeg`를 PATH에서 찾는다. 동봉 바이너리는 이름이
    `ffmpeg-macos-...`이므로 그대로는 안 잡힌다 → `ffmpeg` 심링크를 만들어
    쓰기 가능한 사용자 디렉토리에 두고 PATH 앞에 붙인다.
    """
    exe = ffmpeg_exe()
    if os.path.basename(exe) == "ffmpeg":  # 이미 표준 이름(시스템/번들)
        _prepend_path(os.path.dirname(exe))
        return exe
    home = (os.environ.get("VOCAST_HOME")
            or os.environ.get("NOISECLEANER_HOME")
            or os.path.expanduser("~/.vocast"))
    bindir = os.path.join(home, "bin")
    os.makedirs(bindir, exist_ok=True)
    link = os.path.join(bindir, "ffmpeg")
    try:
        if os.path.realpath(link) != os.path.realpath(exe):
            if os.path.lexists(link):
                os.remove(link)
            os.symlink(exe, link)
    except OSError:
        pass
    _prepend_path(bindir)
    return link


def _prepend_path(d):
    parts = os.environ.get("PATH", "").split(os.pathsep)
    if d not in parts:
        os.environ["PATH"] = os.pathsep.join([d, *parts])


def probe_stderr(path):
    """`ffmpeg -i path`의 stderr 텍스트 (스트림/길이 파싱용). 출력을 안 지정하면
    ffmpeg는 종료코드 1로 정보만 stderr에 찍는다 — 그 텍스트를 그대로 돌려준다."""
    proc = subprocess.run([ffmpeg_exe(), "-hide_banner", "-i", path],
                          capture_output=True, text=True)
    return proc.stderr or ""


_DUR_RE = re.compile(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)")
