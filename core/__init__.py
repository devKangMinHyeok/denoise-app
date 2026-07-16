"""denoise-app 핵심 로직 패키지.

- core.audio   : ffmpeg 래퍼 (스트림 검사, 오디오 추출)
- core.denoise : 배경 소음 제거 파이프라인 (RNNoise)
- core.clone   : 보이스 클로닝 파이프라인 (Qwen3-TTS)
- core.metrics : 품질 평가 지표 (SIM / CER / DNSMOS / 북극성 점수)

CLI(denoise.py, voice/clone_say.py), 웹 서버(web/server.py), CI(quality/)가
전부 이 패키지 하나만 바라본다.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(ROOT, "models")
RNNOISE_MODEL = os.path.join(MODELS_DIR, "rnnoise-sh.rnnn")
DNSMOS_MODEL = os.path.join(MODELS_DIR, "dnsmos_sig_bak_ovr.onnx")
