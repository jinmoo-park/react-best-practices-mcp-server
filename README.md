# React Best Practices MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP (Model Context Protocol) 서버로 Vercel의 React/Next.js 성능 최적화 가이드를 제공합니다. 이 서버를 통해 AI 에이전트가 React/Next.js 코드를 작성하거나 리뷰할 때 Vercel의 베스트 프랙티스를 참조할 수 있습니다.

## 기능

이 MCP 서버는 다음과 같은 기능을 제공합니다:

- **규칙 목록 조회**: 모든 React/Next.js 베스트 프랙티스 규칙을 카테고리, 영향도, 태그로 필터링하여 조회
- **규칙 상세 조회**: 특정 규칙의 상세 정보와 코드 예제 확인
- **규칙 검색**: 키워드로 규칙 검색
- **카테고리 목록**: 8개 카테고리(Waterfalls, Bundle Size, Server Performance 등) 조회
- **메타데이터 조회**: 가이드의 메타데이터 확인

## 설치

```bash
git clone <repository-url>
cd react-best-practices-mcp-server
npm install
npm run build
```

## 실행

### 개발 모드
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## MCP 클라이언트 설정

MCP 클라이언트(예: Claude Desktop, Cursor)의 설정 파일에 추가:

### Claude Desktop

설정 파일 위치:
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "react-best-practices": {
      "command": "node",
      "args": ["/absolute/path/to/react-best-practices-mcp-server/dist/index.js"],
      "cwd": "/absolute/path/to/react-best-practices-mcp-server"
    }
  }
}
```

### Cursor

`.cursor/mcp.json` 파일을 생성하거나 편집:

```json
{
  "mcpServers": {
    "react-best-practices": {
      "command": "node",
      "args": ["/absolute/path/to/react-best-practices-mcp-server/dist/index.js"],
      "cwd": "/absolute/path/to/react-best-practices-mcp-server"
    }
  }
}
```

> **참고**: 자세한 설정 방법은 [MCP_CONFIG.md](./MCP_CONFIG.md)를 참고하세요.

## 사용 가능한 도구

### 1. `list_rules`
모든 규칙을 목록으로 조회합니다. 카테고리, 영향도, 태그로 필터링 가능합니다.

**매개변수:**
- `category` (선택): 카테고리 필터 (async, bundle, server, client, rerender, rendering, js, advanced)
- `impact` (선택): 영향도 필터 (CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM, LOW)
- `tags` (선택): 태그 배열 필터

**예시:**
```json
{
  "name": "list_rules",
  "arguments": {
    "category": "async",
    "impact": "CRITICAL"
  }
}
```

### 2. `get_rule`
특정 규칙의 상세 정보를 조회합니다.

**매개변수:**
- `ruleId` (필수): 규칙 ID (예: "async-parallel", "bundle-barrel-imports")

**예시:**
```json
{
  "name": "get_rule",
  "arguments": {
    "ruleId": "async-parallel"
  }
}
```

### 3. `search_rules`
키워드로 규칙을 검색합니다.

**매개변수:**
- `query` (필수): 검색 쿼리
- `limit` (선택): 최대 결과 수 (기본값: 10)

**예시:**
```json
{
  "name": "search_rules",
  "arguments": {
    "query": "waterfall",
    "limit": 5
  }
}
```

### 4. `list_categories`
모든 카테고리 목록과 각 카테고리의 규칙 수를 조회합니다.

**예시:**
```json
{
  "name": "list_categories"
}
```

### 5. `get_metadata`
React Best Practices 가이드의 메타데이터를 조회합니다.

**예시:**
```json
{
  "name": "get_metadata"
}
```

## 카테고리

1. **Eliminating Waterfalls** (async) - CRITICAL
   - 순차적인 await로 인한 성능 저하를 제거

2. **Bundle Size Optimization** (bundle) - CRITICAL
   - 초기 번들 크기 최적화

3. **Server-Side Performance** (server) - HIGH
   - 서버 사이드 렌더링 및 데이터 페칭 최적화

4. **Client-Side Data Fetching** (client) - MEDIUM-HIGH
   - 클라이언트 데이터 페칭 패턴 최적화

5. **Re-render Optimization** (rerender) - MEDIUM
   - 불필요한 리렌더링 최소화

6. **Rendering Performance** (rendering) - MEDIUM
   - 렌더링 성능 최적화

7. **JavaScript Performance** (js) - LOW-MEDIUM
   - JavaScript 마이크로 최적화

8. **Advanced Patterns** (advanced) - LOW
   - 고급 패턴 및 특수 케이스

## 기여하기

이슈 리포트나 풀 리퀘스트를 환영합니다! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](./LICENSE) 파일을 참고하세요.

## 저자

Vercel Engineering

## 관련 링크

- [React Best Practices 원본 가이드](https://github.com/vercel/react-best-practices)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Vercel Engineering Blog](https://vercel.com/blog)
