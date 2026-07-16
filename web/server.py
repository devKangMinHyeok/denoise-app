#!/usr/bin/env python3
"""로컬 웹 서버: 노이즈 제거 + 보이스 클로닝.

브라우저에서 파일을 올리면 처리해서 돌려준다. 모든 처리는 이 컴퓨터 안에서만
일어나고, 파일이 외부로 전송되지 않는다. (핵심 로직은 core/)

실행:
  python3 web/server.py            # http://127.0.0.1:8756
  python3 web/server.py --port 9000
"""
import argparse
import os
import sys
import tempfile
import uuid

from flask import Flask, jsonify, request, send_file, send_from_directory

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from core.audio import audio_codec_args, ensure_ffmpeg, has_video_stream, run_ffmpeg  # noqa: E402
from core.clone import clone_available, prepare_reference, synthesize  # noqa: E402
from core.denoise import build_audio_filter  # noqa: E402

WORK = os.path.join(tempfile.gettempdir(), "denoise-app-work")
os.makedirs(WORK, exist_ok=True)

MEDIA_EXTS = {".mov", ".mp4", ".m4v", ".mkv", ".wav", ".m4a", ".mp3", ".aac"}

app = Flask(__name__)


@app.get("/")
def index():
    return send_from_directory(os.path.join(HERE, "static"), "index.html")


@app.get("/api/health")
def health():
    return jsonify(ok=True, denoise=True, clone=clone_available())


def _save_upload(f):
    name, ext = os.path.splitext(os.path.basename(f.filename))
    ext = ext.lower()
    if ext not in MEDIA_EXTS:
        raise ValueError(f"지원하지 않는 형식입니다: {ext}")
    path = os.path.join(WORK, f"in_{uuid.uuid4().hex[:8]}{ext}")
    f.save(path)
    return path, name, ext


@app.post("/api/denoise")
def denoise_api():
    f = request.files.get("file")
    if not f or not f.filename:
        return jsonify(error="파일이 없습니다"), 400
    try:
        boost = float(request.form.get("boost") or 0)
    except ValueError:
        boost = 0.0
    try:
        in_path, name, ext = _save_upload(f)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    out_ext = ext if ext != ".mp3" else ".m4a"
    out_path = os.path.join(WORK, f"out_{uuid.uuid4().hex[:8]}{out_ext}")
    args = ["-i", in_path]
    if has_video_stream(in_path):
        args += ["-c:v", "copy"]
    args += ["-af", build_audio_filter(boost)]
    args += audio_codec_args(out_ext)
    args.append(out_path)
    try:
        run_ffmpeg(args)
    except RuntimeError as e:
        return jsonify(error=str(e)), 500
    finally:
        os.remove(in_path)
    return send_file(out_path, as_attachment=True,
                     download_name=f"{name}_clean{out_ext}")


@app.post("/api/clone")
def clone_api():
    if not clone_available():
        return jsonify(error="이 서버 환경에 mlx-audio가 설치되어 있지 않습니다. "
                             "pip install -r voice/requirements-voice.txt"), 501
    f = request.files.get("ref")
    text = (request.form.get("text") or "").strip()
    fast = request.form.get("fast") == "1"
    if not f or not f.filename:
        return jsonify(error="참조 목소리 파일이 없습니다"), 400
    if not text:
        return jsonify(error="읽어줄 대본이 비어 있습니다"), 400
    if len(text) > 2000:
        return jsonify(error="대본이 너무 깁니다 (2000자 이내)"), 400
    try:
        ref_path, name, _ = _save_upload(f)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    out_path = os.path.join(WORK, f"clone_{uuid.uuid4().hex[:8]}.wav")
    try:
        with tempfile.TemporaryDirectory() as wd:
            ref_wav, ref_text = prepare_reference(ref_path, wd)
            synthesize(text, ref_wav, ref_text, out_path, fast=fast)
    except RuntimeError as e:
        return jsonify(error=str(e)), 500
    finally:
        os.remove(ref_path)
    return send_file(out_path, as_attachment=True,
                     download_name=f"{name}_클론낭독.wav")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8756)
    args = ap.parse_args()
    ensure_ffmpeg()
    feats = "노이즈 제거" + (" + 보이스 클로닝" if clone_available() else
                            " (클로닝: 미설치 — voice/requirements-voice.txt)")
    print(f"노이즈 클리너 [{feats}] → http://127.0.0.1:{args.port}")
    app.run(host="127.0.0.1", port=args.port)


if __name__ == "__main__":
    main()
