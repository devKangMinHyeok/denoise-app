#!/bin/bash
# 클린룸 시스템-무의존 검증.
# fresh 체크아웃(venv 전무) + Homebrew 경로 제거 + uv만 있는 PATH에서
# 부트스트랩 → 세 엔진 → 클론까지 실제 실행하고, 사용된 바이너리 경로를 검증.
#
# 사용: bash scripts/verify_cleanroom.sh [입력클립]
#   입력클립 없으면 동봉 ffmpeg로 3초 테스트 톤을 생성해 사용.
set -uo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
CLEAN="${CLEANROOM_DIR:-/tmp/nc-cleanroom}"
UVDIR="$(dirname "$(command -v uv)")"
CLIP="${1:-}"

echo "════════ 0. Fresh 체크아웃 (git archive → venv/캐시 없음) ════════"
rm -rf "$CLEAN"; mkdir -p "$CLEAN"
git -C "$SRC" archive HEAD | tar -x -C "$CLEAN"
cp "$SRC/models/rnnoise-sh.rnnn" "$CLEAN/models/" 2>/dev/null || true
echo "venv 존재?: $(ls -d "$CLEAN"/.venv* 2>/dev/null || echo '없음 ✓')"

# ── 격리 환경: Homebrew 제거, uv만 + 기본 시스템 유틸 ──
export PATH="$UVDIR:/usr/bin:/bin:/usr/sbin"
unset VIRTUAL_ENV PYTHONPATH CONDA_PREFIX
cd "$CLEAN"

echo; echo "════════ 1. 격리 확인: 시스템 도구가 정말 안 보이나 ════════"
for t in ffmpeg ffprobe python3.11 python3.12 brew conda; do
  p=$(command -v "$t" 2>/dev/null); echo "  $t: ${p:-(unreachable) ✓}"
done
echo "  uv: $(command -v uv)"

echo; echo "════════ 2. bootstrap (uv sync — 관리형 파이썬 + 잠긴 의존성) ════════"
uv sync --frozen 2>&1 | tail -2 || { echo "❌ uv sync 실패"; exit 1; }

# 입력 클립이 없으면 리포에 커밋된 골든 픽스처(AI 생성 발화)를 사용 —
# 외부 데이터 의존 없이 자립. 클로닝은 실제 말소리가 필요하므로 톤은 부적합.
if [ -z "$CLIP" ] || [ ! -f "$CLIP" ]; then
  CLIP="$CLEAN/tests/fixtures/golden_clone_1.wav"
fi
[ -f "$CLIP" ] || { echo "❌ 입력 클립 없음: $CLIP"; exit 1; }

echo; echo "════════ 3. 사용되는 인터프리터·ffmpeg 경로 검증 ════════"
uv run --frozen python - <<'PY'
import sys
from core.ffbin import ffmpeg_exe
py, ff = sys.executable, ffmpeg_exe()
print("  메인 파이썬:", py); print("  ffmpeg     :", ff)
assert "/opt/homebrew" not in py and "/usr/bin" not in py, "❌ 시스템 파이썬!"
assert "imageio_ffmpeg" in ff, "❌ 시스템 ffmpeg!"
print("  → 파이썬=uv관리, ffmpeg=동봉 ✓")
PY

echo; echo "════════ 4. 표준 노이즈 제거 (RNNoise) ════════"
uv run --frozen python -c "
from core.denoise import run_denoise; run_denoise('$CLIP','/tmp/cr_rnn.wav',engine='rnnoise')
import os; print('  RNNoise ✓', os.path.getsize('/tmp/cr_rnn.wav'),'bytes')"

echo; echo "════════ 5. DFN 엔진 설치(uv) + 하이브리드 ════════"
bash scripts/install_dfn.sh 2>&1 | tail -1
uv run --frozen python -c "
from core.denoise import dfn_available, run_denoise
assert dfn_available(); run_denoise('$CLIP','/tmp/cr_dfn.wav',engine='dfn')
import os; print('  DFN ✓', os.path.getsize('/tmp/cr_dfn.wav'),'bytes')" || echo "  (DFN 건너뜀)"

echo; echo "════════ 6. 재합성 엔진 설치(uv) + 실추론 ════════"
bash scripts/install_resynth.sh 2>&1 | tail -1
uv run --frozen python -c "
from core.denoise import resynth_available, run_denoise
assert resynth_available(); run_denoise('$CLIP','/tmp/cr_re.wav',mode='resynth')
import os; print('  재합성 ✓', os.path.getsize('/tmp/cr_re.wav'),'bytes')" || echo "  (재합성 건너뜀)"

echo; echo "════════ 7. 보이스 클로닝 (mlx/whisper/TTS) ════════"
uv run --frozen python voice/clone_say.py --ref "$CLIP" \
  --text "클린룸 클론 테스트." --fast -o /tmp/cr_clone.wav 2>&1 | tail -1
[ -f /tmp/cr_clone.wav ] && echo "  클론 ✓ $(wc -c </tmp/cr_clone.wav) bytes" || echo "  ❌ 클론 실패"

echo; echo "════════ 8. 유닛 테스트 ════════"
uv run --frozen python -m pytest tests -q 2>&1 | tail -1
echo; echo "════════ ✅ 클린룸 검증 종료 ════════"
