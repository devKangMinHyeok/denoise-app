#!/usr/bin/env python3
"""release-build-guard - PreToolUse hook.

맥 앱은 출시 전까지 항상 베타로 빌드한다. 프로덕션(release) 빌드는 사용자가
"출시"를 명시적으로 지시했을 때만 뽑는다.

이 훅은 Bash 명령에서 release 변종 빌드를 감지하면 차단이 아니라 확인(ask)을
띄운다. 정당한 출시까지 막으면 안 되므로, 사용자가 승인하면 그대로 진행된다.
build_app.sh 자체에도 가드가 있어(VOCAST_RELEASE_CONFIRM, VOCAST_SIGN_ID)
이 훅은 그 앞단에서 사람 눈에 먼저 보여주는 역할이다.
"""
import json
import re
import sys

# `VOCAST_VARIANT=release`, `make release`, 따옴표 변형까지 잡는다.
PATTERNS = [
    re.compile(r"VOCAST_VARIANT\s*=\s*[\"']?release", re.I),
    re.compile(r"VOCAST_RELEASE_CONFIRM\s*=\s*[\"']?yes", re.I),
    re.compile(r"\bmake\s+release\b", re.I),
]


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)  # 파싱 실패 시 통과 - 정상 작업을 막지 않는다

    if data.get("tool_name") != "Bash":
        sys.exit(0)

    command = str((data.get("tool_input") or {}).get("command") or "")
    if not any(p.search(command) for p in PATTERNS):
        sys.exit(0)

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": (
                "[release-build-guard] 프로덕션(release) 맥 앱 빌드를 시도합니다. "
                "이 저장소는 출시 전까지 베타로만 빌드합니다. "
                "출시하려는 것이 맞다면 승인하세요. "
                "테스트용이라면 거절하고 `bash apps/mac/build_app.sh`(베타)를 쓰세요."
            ),
        }
    }))
    sys.exit(0)


main()
