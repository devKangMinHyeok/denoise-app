#!/bin/bash
# Vocast 한 방 설치 — 체크아웃 후 이것만 실행하면 실행 준비 완료.
#
# 격리 원칙: 시스템에 python·ffmpeg·brew가 없어도 된다. uv 하나만 있으면
# 관리형 파이썬(3.12/3.11)을 내려받고, ffmpeg는 휠(imageio-ffmpeg)로 동봉된다.
# 유일한 전제: uv (curl -LsSf https://astral.sh/uv/install.sh | sh)
set -euo pipefail
cd "$(dirname "$0")"

command -v uv >/dev/null 2>&1 || {
  echo "❌ uv가 필요합니다. 설치:"
  echo "   curl -LsSf https://astral.sh/uv/install.sh | sh"
  exit 1; }

echo "▸ 메인 환경 동기화 (uv 관리 파이썬 3.12 + 잠긴 의존성 + 동봉 ffmpeg)..."
uv sync --frozen

echo "▸ DNSMOS 품질 모델 내려받기 (평가용, 선택)..."
bash scripts/download_dnsmos.sh 2>/dev/null || echo "  (건너뜀 — 평가 기능 쓸 때 scripts/download_dnsmos.sh)"

echo
echo "선택 엔진 (원할 때 별도 설치):"
echo "  • 하이브리드 노이즈 제거(DFN):   bash scripts/install_dfn.sh"
echo "  • 재합성(발화 중 노이즈까지):    bash scripts/install_resynth.sh"
echo
echo "✅ 준비 완료. 실행:  uv run python web/server.py"
echo "   (TTS·클로닝 모델은 최초 실행 시 자동 다운로드됩니다)"
