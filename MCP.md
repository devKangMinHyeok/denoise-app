# 로컬 MCP 서버 — Claude·Codex가 앱을 직접 조작

이 앱의 기능을 [MCP](https://modelcontextprotocol.io)(Model Context Protocol)
도구로 노출한다. Claude Desktop·Claude Code·Codex 등 MCP 지원 에이전트에
등록하면, **대화로 시키면 에이전트가 앱을 대신 조작**한다.

전부 로컬에서 stdio로 도는 로컬 MCP다 — 네트워크·클라우드 불필요.

## 노출 도구

| 도구 | 하는 일 |
|------|--------|
| `health` | 사용 가능한 기능·엔진 상태 (clone은 Apple Silicon만) |
| `denoise` | 파일 노이즈 제거 (standard/resynth) + 품질 리포트 |
| `list_voice_profiles` | 등록된 보이스 프로필 목록 |
| `clone_voice` | 텍스트를 지정 목소리로 낭독 생성 (프로필 또는 참조 파일) |
| `list_history` | 최근 생성 작업 기록 |

## 등록

등록에 넣을 설정을 출력:

```bash
python mcp_server.py --config
```

출력 예:
```json
{
  "mcpServers": {
    "noise-cleaner": {
      "command": "/경로/.venv/bin/python",
      "args": ["/경로/mcp_server.py"]
    }
  }
}
```

- **Claude Desktop**: `~/Library/Application Support/Claude/claude_desktop_config.json`
  의 `mcpServers`에 위 내용을 병합.
- **Claude Code**: `claude mcp add noise-cleaner -- /경로/.venv/bin/python /경로/mcp_server.py`
- **봉인 번들**: command를 `<번들>/runtime/.venv/bin/python`,
  args를 `<번들>/mcp_server.py`로.

등록 후 에이전트를 재시작하면 도구가 뜬다.

## 사용 예 (에이전트에게 말로)

> "바탕화면의 인터뷰.mov 노이즈 제거하고, 그 결과로 인트로 대본을 내 목소리로 읽어줘"

에이전트가 순서대로:
`denoise("인터뷰.mov")` → `list_voice_profiles()` →
`clone_voice(text=..., profile_id=...)` 를 호출한다.

## 검증 (실측)

MCP 클라이언트로 실서버에 붙어 `initialize` → `tools/list` → `tools/call`
전 과정 확인: health·denoise(실제 노이즈 제거)·list_history 정상 응답.
유닛 테스트(`test_mcp_server_registers_tools`)가 도구 등록을 회귀 방지.

## 참고

- `clone_voice`는 동기 호출이라 수 분 걸릴 수 있다 (에이전트가 대기).
- 보이스 클로닝은 **본인/동의받은 목소리만** 사용할 것 (도구 설명에도 명시).
