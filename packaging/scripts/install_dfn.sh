#!/bin/bash
# DeepFilterNet(하이브리드 노이즈 제거 엔진) 설치 — uv 봉인.
# 전용 py3.11 venv를 쓰는 이유: deepfilterlib이 3.12+ 휠이 없어 Rust 컴파일을
# 요구하고, torch 2.2+에서 구 torchaudio API가 제거되어 버전 핀이 필요하다.
# uv가 관리형 CPython 3.11을 내려받으므로 시스템 python3.11(brew) 불필요.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../app" && pwd)"

command -v uv >/dev/null 2>&1 || {
  echo "uv가 필요합니다: curl -LsSf https://astral.sh/uv/install.sh | sh"; exit 1; }

echo "DFN 전용 venv 생성 (uv 관리 파이썬 3.11)..."
uv venv --python 3.11 "$ROOT/.venv-dfn"
VIRTUAL_ENV="$ROOT/.venv-dfn" uv pip install -q \
  "deepfilternet==0.5.6" "torch==2.1.2" "torchaudio==2.1.2" \
  "soundfile==0.14.0" "numpy<2"
"$ROOT/.venv-dfn/bin/python" -c "import df, torch; print('DeepFilterNet OK')"
echo "완료 — 이제 노이즈 제거가 자동으로 하이브리드(DFN) 엔진을 씁니다."
echo "(끄려면 .venv-dfn 폴더를 지우면 RNNoise로 폴백)"
