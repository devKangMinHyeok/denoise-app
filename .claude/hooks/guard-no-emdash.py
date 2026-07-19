#!/usr/bin/env python3
"""no-emdash-guard - PreToolUse hook.

이 저장소의 콘텐츠/코드에 긴 대시 구분자가 들어가는 것을 하드 차단한다.
차단 대상: U+2014 (em dash), U+2015 (horizontal bar).
규칙: 응답과 생성 콘텐츠/코드/예제 어디에도 긴 대시 구분자를 쓰지 않는다.
쉼표/콜론/마침표/괄호로 바꾸거나 문장을 다시 쓴다.
(literal 문자를 이 파일에 남기지 않으려고 유니코드 이스케이프로만 검사한다.)
"""
import json
import sys

BANNED = {
    chr(0x2014): "em dash (U+2014)",
    chr(0x2015): "horizontal bar (U+2015)",
}


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        sys.exit(0)  # 파싱 실패 시 통과 - 정상 쓰기를 막지 않는다

    if data.get("tool_name") not in ("Write", "Edit", "MultiEdit"):
        sys.exit(0)

    ti = data.get("tool_input") or {}
    texts = []
    if ti.get("content"):
        texts.append(str(ti["content"]))
    if ti.get("new_string"):
        texts.append(str(ti["new_string"]))
    for e in ti.get("edits") or []:
        if isinstance(e, dict) and e.get("new_string"):
            texts.append(str(e["new_string"]))
    blob = "\n".join(texts)

    hits = [name for ch, name in BANNED.items() if ch in blob]
    if hits:
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    "[no-emdash-guard] "
                    + ", ".join(hits)
                    + " 감지. 이 저장소는 긴 대시 구분자를 쓰지 않습니다. "
                    "쉼표/콜론/마침표/괄호로 바꾸거나 문장을 다시 쓰세요."
                ),
            }
        }))
        sys.exit(0)

    sys.exit(0)


main()
