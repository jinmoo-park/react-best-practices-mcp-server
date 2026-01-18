# MCP 서버 설정 가이드

이 문서는 React Best Practices MCP 서버를 다양한 MCP 클라이언트에 설정하는 방법을 설명합니다.

## Claude Desktop 설정

### Windows

`%APPDATA%\Claude\claude_desktop_config.json` 파일을 편집:

```json
{
  "mcpServers": {
    "react-best-practices": {
      "command": "node",
      "args": [
        "C:/Users/Jinmoo Park/Desktop/agent-skills-main/skills/react-best-practices/mcp-server/dist/index.js"
      ],
      "cwd": "C:/Users/Jinmoo Park/Desktop/agent-skills-main/skills/react-best-practices/mcp-server"
    }
  }
}
```

### macOS

`~/Library/Application Support/Claude/claude_desktop_config.json` 파일을 편집:

```json
{
  "mcpServers": {
    "react-best-practices": {
      "command": "node",
      "args": [
        "/path/to/react-best-practices/mcp-server/dist/index.js"
      ],
      "cwd": "/path/to/react-best-practices/mcp-server"
    }
  }
}
```

### Linux

`~/.config/Claude/claude_desktop_config.json` 파일을 편집:

```json
{
  "mcpServers": {
    "react-best-practices": {
      "command": "node",
      "args": [
        "/path/to/react-best-practices/mcp-server/dist/index.js"
      ],
      "cwd": "/path/to/react-best-practices/mcp-server"
    }
  }
}
```

## Cursor 설정

`.cursor/mcp.json` 파일을 생성하거나 편집:

```json
{
  "mcpServers": {
    "react-best-practices": {
      "command": "node",
      "args": [
        "C:/Users/Jinmoo Park/Desktop/agent-skills-main/skills/react-best-practices/mcp-server/dist/index.js"
      ],
      "cwd": "C:/Users/Jinmoo Park/Desktop/agent-skills-main/skills/react-best-practices/mcp-server"
    }
  }
}
```

## 사용 전 준비사항

1. **의존성 설치**
   ```bash
   cd mcp-server
   npm install
   ```

2. **빌드**
   ```bash
   npm run build
   ```

3. **경로 확인**
   - 설정 파일의 경로가 실제 프로젝트 경로와 일치하는지 확인
   - `dist/index.js` 파일이 존재하는지 확인

## 테스트

MCP 서버가 정상적으로 작동하는지 테스트하려면:

```bash
cd mcp-server
npm run dev
```

서버가 시작되면 STDIO를 통해 통신합니다. MCP 클라이언트가 자동으로 서버와 연결됩니다.

## 문제 해결

### "Cannot find module" 오류
- `npm run build`를 실행하여 TypeScript를 컴파일했는지 확인
- `dist/` 폴더가 존재하는지 확인

### "ENOENT" 오류
- 설정 파일의 경로가 올바른지 확인
- 절대 경로를 사용하는 것을 권장

### 규칙 파일을 찾을 수 없음
- `BASE_DIR`이 올바르게 설정되어 있는지 확인
- `rules/` 폴더가 `mcp-server/` 폴더의 상위 디렉토리에 있는지 확인
