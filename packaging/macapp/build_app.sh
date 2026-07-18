#!/bin/bash
# 맥 앱(.app 번들) 빌드 스크립트.
#   bash packaging/macapp/build_app.sh                # 노이즈 제거만
#   bash packaging/macapp/build_app.sh --with-voice   # + 보이스 클로닝 (Apple Silicon)
# 실행하면 dist/Vocast.app 이 만들어진다.
# 앱을 더블클릭하면: 로컬 서버를 켜고 → 브라우저로 웹 UI를 연다.
set -euo pipefail

# packaging/macapp/ 에 산다 → 저장소 루트는 두 단계 위, 파이썬 엔진은 app/
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
ENGINE="$REPO/app"
DIST="$REPO/dist"
APP="$DIST/Vocast.app"
PORT=8756
WITH_VOICE="${1:-}"

# mlx가 지원하는 파이썬 우선 (3.12/3.13), 없으면 시스템 python3
PYBIN=python3
for p in python3.12 python3.13; do
  if command -v "$p" >/dev/null 2>&1; then PYBIN="$p"; break; fi
done

if [ ! -x "$ENGINE/.venv/bin/python3" ]; then
  echo "가상환경 생성 중 ($PYBIN)..."
  "$PYBIN" -m venv "$ENGINE/.venv"
  # 앱 계층(flask·mcp) + voxa 엔진(모노레포 packages/voxa, 평가 포함)
  "$ENGINE/.venv/bin/pip" install -q flask "mcp>=1.2" -e "$REPO/packages/voxa[eval]"
fi
if [ "$WITH_VOICE" = "--with-voice" ]; then
  echo "보이스 클로닝 의존성 설치 중..."
  "$ENGINE/.venv/bin/pip" install -q -r "$ENGINE/voice/requirements-voice.txt"
fi

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS"

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Vocast</string>
  <key>CFBundleDisplayName</key><string>Vocast</string>
  <key>CFBundleExecutable</key><string>run</string>
  <key>CFBundleIdentifier</key><string>dev.minhyeok.vocast</string>
  <key>CFBundleVersion</key><string>2.0</string>
  <key>CFBundleShortVersionString</key><string>2.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>LSMinimumSystemVersion</key><string>12.0</string>
</dict>
</plist>
PLIST

cat > "$APP/Contents/MacOS/run" <<LAUNCHER
#!/bin/bash
ENGINE="$ENGINE"
PORT=$PORT
PY="\$ENGINE/.venv/bin/python3"
[ -x "\$PY" ] || PY=python3

if ! curl -s "http://127.0.0.1:\$PORT/api/health" >/dev/null 2>&1; then
  nohup "\$PY" "\$ENGINE/api/server.py" --port "\$PORT" > /tmp/vocast.log 2>&1 &
  for i in \$(seq 1 40); do
    curl -s "http://127.0.0.1:\$PORT/api/health" >/dev/null 2>&1 && break
    sleep 0.25
  done
fi
open "http://127.0.0.1:\$PORT"
LAUNCHER

chmod +x "$APP/Contents/MacOS/run"
echo "완성: $APP"
echo "더블클릭하거나: open '$APP'"
