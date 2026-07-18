#!/bin/bash
# 재합성(resemble-enhance) 엔진 설치 — 전용 py3.11 venv (.venv-re)
#
# 왜 전용 venv인가: resemble-enhance는 torchaudio==2.1.1 등 구버전을 고정하고
# deepspeed(학습용, Mac 미설치)를 의존성에 포함한다. 본 venv를 오염시키지 않고
# --no-deps로 깔아 추론에 필요한 것만 채운다 (DFN의 .venv-dfn과 같은 패턴).
#
# 실측으로 확정한 것:
# - deepspeed는 추론 경로에서 심볼만 참조 → 최소 스텁으로 대체
# - numpy 2.x에서 CFM 솔버의 float(fsolve(...)) 가 죽음 → numpy<2 고정
# - torchaudio 2.11의 load는 torchcodec 요구 → IO는 soundfile로 (워커가 처리)
# - 모델은 git-lfs 대신 huggingface_hub로 받는다 (워커가 run_dir 직접 지정)
# uv가 관리형 CPython 3.11을 내려받으므로 시스템 python3.11(brew) 불필요.
set -e
cd "$(dirname "$0")/../../app"

command -v uv >/dev/null 2>&1 || {
  echo "uv가 필요합니다: curl -LsSf https://astral.sh/uv/install.sh | sh"; exit 1; }

uv venv --python 3.11 .venv-re
VIRTUAL_ENV=.venv-re uv pip install resemble-enhance --no-deps
VIRTUAL_ENV=.venv-re uv pip install torch torchaudio "numpy<2" librosa soundfile \
  rich tqdm resampy tabulate omegaconf pandas matplotlib huggingface_hub

bash "$(dirname "$0")/_deepspeed_stub.sh" .venv-re
echo "완료 — 서버를 재시작하면 노이즈 제거 탭에 '재합성' 모드가 나타납니다"
