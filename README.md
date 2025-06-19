This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 커밋 컨벤션 (Commit Convention)

이 프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 사양을 따릅니다. 이는 커밋 메시지를 구조화하여 변경 사항의 유형을 쉽게 파악하고, 자동화된 도구로 변경 로그를 생성하는 데 도움이 됩니다.

커밋 메시지 형식은 다음과 같습니다:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Type (유형)

커밋 유형은 변경의 종류를 나타냅니다. 다음 중 하나를 사용합니다:

*   `feat`: 새로운 기능 추가 (A new feature)
*   `fix`: 버그 수정 (A bug fix)
*   `docs`: 문서 변경 (Documentation only changes)
*   `style`: 코드 스타일 변경 (세미콜론, 공백, 포맷팅 등; 기능에 영향 없음) (Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc))
*   `refactor`: 코드 리팩토링 (기능 변경 없음, 버그 수정 없음) (A code change that neither fixes a bug nor adds a feature)
*   `perf`: 성능 개선 (A code change that improves performance)
*   `test`: 테스트 코드 추가 또는 수정 (Adding missing tests or correcting existing tests)
*   `build`: 빌드 시스템 또는 외부 의존성 관련 변경 (예: npm, pnpm) (Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm))
*   `ci`: CI/CD 설정 파일 및 스크립트 변경 (Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs))
*   `chore`: 빌드 프로세스 또는 보조 도구 변경 (예: .gitignore 수정) (Other changes that don't modify src or test files)
*   `revert`: 이전 커밋 되돌리기 (Reverts a previous commit)

### Scope (범위) - 선택 사항

변경 사항이 영향을 미치는 특정 부분을 나타냅니다. 예를 들어, `app`, `components`, `utils`, `models`, `interfaces` 등이 될 수 있습니다.

### Subject (제목)

변경 사항에 대한 간결하고 설명적인 요약입니다.

*   명령형, 현재형 동사를 사용합니다. (예: "add", "fix", "change")
*   첫 글자는 대문자로 시작하지 않습니다.
*   끝에 마침표를 찍지 않습니다.

### Body (본문) - 선택 사항

제목 외에 더 자세한 설명을 추가할 경우 사용합니다.

*   각 줄은 72자 이내로 작성합니다.
*   "무엇을" 보다는 "왜" 변경했는지에 초점을 맞춥니다.

### Footer (바닥글) - 선택 사항

Breaking Changes(호환성 변경) 또는 Issue 참조(예: `Closes #123`) 등을 포함합니다.

---
