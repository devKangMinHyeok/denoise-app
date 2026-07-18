#!/usr/bin/env python3
"""영상/음성 배경 소음 제거 CLI. (핵심 로직은 core/denoise.py)

사용법:
  python3 denoise.py input.mov                # → input_clean.mov
  python3 denoise.py input.mov -o output.mov  # 출력 이름 지정
  python3 denoise.py input.mov --boost 13     # 볼륨도 13dB 키우기
"""
import argparse
import os
import sys

from voxa.media.audio import ensure_ffmpeg
from voxa.denoise import run_denoise


def main():
    ap = argparse.ArgumentParser(description="영상/음성 배경 소음 제거")
    ap.add_argument("input", help="입력 파일 (mov, mp4, wav, m4a 등)")
    ap.add_argument("-o", "--output", help="출력 파일 경로 (기본: 입력이름_clean.확장자)")
    ap.add_argument("--boost", type=float, default=0.0,
                    help="노이즈 제거 후 볼륨을 N dB 키움 (기본 0)")
    args = ap.parse_args()

    try:
        ensure_ffmpeg()
    except RuntimeError as e:
        sys.exit(str(e))
    if not os.path.exists(args.input):
        sys.exit(f"입력 파일이 없습니다: {args.input}")

    base, ext = os.path.splitext(args.input)
    out = args.output or f"{base}_clean{ext or '.mov'}"
    print("처리 중...", os.path.basename(args.input), "→", os.path.basename(out))
    try:
        run_denoise(args.input, out, args.boost)
    except (RuntimeError, ValueError) as e:
        sys.exit(str(e))
    print("완료:", out)


if __name__ == "__main__":
    main()
