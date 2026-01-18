# GitHub 리포지토리 설정 가이드

이 문서는 이 프로젝트를 GitHub에 업로드하는 방법을 안내합니다.

## 1. GitHub에서 새 리포지토리 생성

1. GitHub에 로그인합니다
2. 우측 상단의 "+" 버튼을 클릭하고 "New repository"를 선택합니다
3. 리포지토리 이름을 입력합니다 (예: `react-best-practices-mcp-server`)
4. 설명을 추가합니다: "MCP server for Vercel React Best Practices"
5. Public 또는 Private을 선택합니다
6. **"Initialize this repository with a README"는 체크하지 마세요** (이미 README가 있습니다)
7. "Create repository"를 클릭합니다

## 2. 로컬에서 Git 초기화

터미널에서 프로젝트 디렉토리로 이동합니다:

```bash
cd react-best-practices/mcp-server
```

Git을 초기화합니다:

```bash
git init
```

## 3. 파일 추가 및 커밋

모든 파일을 스테이징합니다:

```bash
git add .
```

첫 커밋을 생성합니다:

```bash
git commit -m "Initial commit: React Best Practices MCP Server"
```

## 4. GitHub 리포지토리와 연결

GitHub에서 생성한 리포지토리의 URL을 확인하고 연결합니다:

```bash
git remote add origin https://github.com/YOUR_USERNAME/react-best-practices-mcp-server.git
```

또는 SSH를 사용하는 경우:

```bash
git remote add origin git@github.com:YOUR_USERNAME/react-best-practices-mcp-server.git
```

## 5. 코드 푸시

메인 브랜치로 푸시합니다:

```bash
git branch -M main
git push -u origin main
```

## 6. package.json 업데이트

GitHub 리포지토리 URL을 확인한 후, `package.json`의 `repository` 필드를 업데이트합니다:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/react-best-practices-mcp-server.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/react-best-practices-mcp-server/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/react-best-practices-mcp-server#readme"
}
```

업데이트 후 다시 커밋합니다:

```bash
git add package.json
git commit -m "Update repository URLs in package.json"
git push
```

## 7. 추가 설정 (선택사항)

### Topics 추가
리포지토리 페이지에서 "Add topics"를 클릭하고 다음을 추가합니다:
- `mcp`
- `react`
- `nextjs`
- `model-context-protocol`
- `vercel`
- `best-practices`
- `performance`

### Description 추가
리포지토리 설명에 다음을 추가합니다:
"MCP server providing Vercel's React/Next.js performance optimization guidelines for AI agents"

### README 뱃지 업데이트
리포지토리 URL이 확정되면 README.md의 뱃지나 링크를 업데이트할 수 있습니다.

## 완료!

이제 GitHub에서 프로젝트를 확인할 수 있습니다. 다른 개발자들이 프로젝트를 찾고 사용할 수 있도록 공유하세요!
