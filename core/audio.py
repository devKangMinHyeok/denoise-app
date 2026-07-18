"""ffmpeg 래퍼 유틸. 바이너리는 core.ffbin이 해결한다 (시스템 설치 비의존)."""
import re
import subprocess

from .ffbin import _DUR_RE, ensure_ffmpeg_on_path, ffmpeg_exe, probe_stderr


def ensure_ffmpeg():
    ffmpeg_exe()  # 못 찾으면 RuntimeError (설치 안내 포함)
    ensure_ffmpeg_on_path()  # 제3자 라이브러리(whisper 등)의 bare 호출 대비


def has_video_stream(path):
    """비디오 스트림 존재 여부 — ffmpeg -i stderr 파싱 (ffprobe 비의존)."""
    return bool(re.search(r"Stream #\d+:\d+.*: Video:", probe_stderr(path)))


def run_ffmpeg(args):
    """ffmpeg 실행 (에러 출력 캡처). 실패 시 stderr를 담은 RuntimeError."""
    proc = subprocess.run([ffmpeg_exe(), "-y", "-v", "error", *args],
                          capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg 실패: {proc.stderr[-400:]}")


def media_duration(path):
    """미디어 길이(초). 실패 시 None. ffmpeg -i의 Duration 라인 파싱."""
    m = _DUR_RE.search(probe_stderr(path))
    if not m:
        return None
    h, mm, s = m.groups()
    return int(h) * 3600 + int(mm) * 60 + float(s)


def make_audio_preview(src, out_m4a, bitrate="96k"):
    """미리듣기용 모노 AAC 추출 — A/B 비교 플레이어가 스트리밍하기 좋게."""
    run_ffmpeg(["-i", src, "-vn", "-ac", "1", "-c:a", "aac",
                "-b:a", bitrate, out_m4a])
    return out_m4a


def audio_codec_args(out_ext):
    """출력 확장자에 맞는 오디오 코덱 인자."""
    if out_ext == ".wav":
        return ["-c:a", "pcm_s16le"]
    return ["-c:a", "aac", "-b:a", "192k"]


def default_output_ext(in_ext):
    """입력 확장자에 대한 권장 출력 확장자 (mp3는 재인코딩 대신 m4a로)."""
    return ".m4a" if in_ext == ".mp3" else in_ext


def concat_to_wav(input_paths, output_path):
    """여러 오디오/영상 파일을 이어붙여 모노 wav로 변환 (가이드 녹음 병합용)."""
    args = []
    for p in input_paths:
        args += ["-i", p]
    n = len(input_paths)
    filt = "".join(f"[{i}:a]" for i in range(n)) + f"concat=n={n}:v=0:a=1[out]"
    run_ffmpeg([*args, "-filter_complex", filt, "-map", "[out]",
                "-ac", "1", "-c:a", "pcm_s16le", output_path])
    return output_path


SPEECH_TARGET_DB = -19.0  # 발화 RMS 목표 (유튜브/팟캐스트 배포 기준 -19~-16)
PEAK_CEILING_DB = -1.5    # 클리핑 방지 피크 상한


def normalize_gain_db(active_rms_db, peak_db,
                      target_db=SPEECH_TARGET_DB, ceiling_db=PEAK_CEILING_DB):
    """발화 RMS를 목표로 올리되 피크가 상한을 넘지 않는 게인(dB). 순수 함수."""
    gain = target_db - active_rms_db
    return min(gain, ceiling_db - peak_db)


def normalize_speech_level(wav_path, target_db=SPEECH_TARGET_DB):
    """정적 게인 음량 정규화 — 무음은 무음으로 유지(동적 펌핑 없음).

    클론 출력은 참조 녹음의 (대개 작은) 음량을 물려받는다 → 배포 기준으로 보정.
    """
    import numpy as np
    import soundfile as sf
    y, sr = sf.read(wav_path, dtype="float32")
    if y.ndim > 1:
        y = y.mean(axis=1)
    peak = np.abs(y).max()
    if peak < 1e-6:
        return wav_path
    hop = int(sr * 0.03)
    nf = len(y) // hop
    db = 20 * np.log10(np.maximum(
        np.sqrt((y[: nf * hop].reshape(nf, hop) ** 2).mean(axis=1)), 1e-9))
    active = db[db > db.max() - 30]  # 발화 구간만
    active_rms_db = float(10 * np.log10(np.mean(10 ** (active / 10))))
    gain_db = normalize_gain_db(active_rms_db, float(20 * np.log10(peak)),
                                target_db=target_db)
    if abs(gain_db) < 0.5:
        return wav_path
    sf.write(wav_path, y * (10 ** (gain_db / 20)), sr)
    return wav_path
