# 기여 가이드

React Best Practices MCP Server에 기여해주셔서 감사합니다!

## 개발 환경 설정

1. 저장소를 포크하고 클론합니다:
```bash
git clone https://github.com/YOUR_USERNAME/react-best-practices-mcp-server.git
cd react-best-practices-mcp-server
```

2. 의존성을 설치합니다:
```bash
npm install
```

3. 빌드합니다:
```bash
npm run build
```

## 개발 워크플로우

1. 새로운 브랜치를 생성합니다:
```bash
git checkout -b feature/your-feature-name
```

2. 변경사항을 커밋합니다:
```bash
git commit -m "Add: your feature description"
```

3. 브랜치를 푸시합니다:
```bash
git push origin feature/your-feature-name
```

4. GitHub에서 Pull Request를 생성합니다.

## 코드 스타일

- TypeScript를 사용합니다
- ESLint 규칙을 따릅니다
- 의미 있는 변수명과 함수명을 사용합니다
- 주석은 복잡한 로직에만 추가합니다

## 테스트

변경사항을 제출하기 전에 다음을 확인하세요:

- [ ] 코드가 빌드됩니다 (`npm run build`)
- [ ] MCP 서버가 정상적으로 시작됩니다 (`npm run dev`)
- [ ] 새로운 기능이 문서화되었습니다

## Pull Request 체크리스트

- [ ] 변경사항이 명확하게 설명되어 있습니다
- [ ] 관련 이슈가 있다면 링크되어 있습니다
- [ ] README나 문서가 필요시 업데이트되었습니다
- [ ] 코드가 기존 스타일을 따릅니다

## 질문이 있으신가요?

이슈를 생성하여 질문해주세요. 기꺼이 도와드리겠습니다!
