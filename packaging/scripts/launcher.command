#!/bin/bash
# Vocast 실행 — 더블클릭용 런처.
# 번들 안의 파이썬만으로 돈다. 시스템에 uv·파이썬·ffmpeg가 없어도 된다.
set -e
BUNDLE="$(cd "$(dirname "$0")" && pwd)"
RT="$BUNDLE/runtime"

# 전용 엔진 파이썬을 번들 경로로 지정 (core가 이 환경변수를 우선 읽음)
export DFN_PYTHON="$RT/.venv-dfn/bin/python3"
export RESYNTH_PYTHON="$RT/.venv-re/bin/python3"
# 사용자 데이터(프로필·작업 기록)는 홈(~/.vocast)에 (번들을 지워도 보존).
# 홈 경로는 파이썬(api/storage.py)이 결정한다 — 옛 ~/.noisecleaner가 있으면
# 자동으로 ~/.vocast로 이관한다. 여기서 강제로 지정하면 그 이관이 건너뛰어지므로,
# 사용자가 명시적으로 VOCAST_HOME을 준 경우에만 그 값을 존중하고 넘긴다.
[ -n "${VOCAST_HOME:-}" ] && export VOCAST_HOME

# 오프라인 모델 동봉본이 있으면 그것을 캐시로 사용 (네트워크 불필요)
[ -d "$BUNDLE/models/hf" ]    && export HF_HOME="$BUNDLE/models/hf"
[ -d "$BUNDLE/models/torch" ] && export TORCH_HOME="$BUNDLE/models/torch"

PORT=8756
echo "Vocast를 시작합니다… (최초 실행 시 음성 모델을 내려받습니다)"
cd "$BUNDLE"
"$RT/.venv/bin/python" api/server.py --port "$PORT" &
SERVER=$!
# 서버가 뜨면 브라우저 열기
for _ in $(seq 1 60); do
  if curl -s "http://127.0.0.1:$PORT/api/health" >/dev/null 2>&1; then
    open "http://127.0.0.1:$PORT"; break
  fi
  sleep 1
done
echo "브라우저에서 http://127.0.0.1:$PORT 를 여세요. (이 창을 닫으면 종료됩니다)"
wait $SERVER
