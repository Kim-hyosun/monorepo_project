# monorepo_project

**pnpm workspaces + Turborepo** 기반 모노레포 데모. 두 개의 Next.js 앱이 공유 패키지를 공유하면서 각자 독립적으로 빌드·배포되는 구조를 보여준다.

## Stack

- **Build/Pkg**: pnpm 9 workspaces, Turborepo 2
- **Framework**: Next.js 15.5.18 (App Router, CSR-first)
- **Runtime**: React 19, TypeScript 5, Node 24.15.0
- **UI**: Tailwind 4, shadcn/ui (base-nova style), base-ui primitives, Lucide
- **State**: Zustand 5 (client) + TanStack Query 5 (server)
- **Form**: React Hook Form + Zod
- **HTTP**: axios

## Structure

```
monorepo_project/
├── package.json              # 루트. workspace + turbo + 공통 devDeps만
├── pnpm-workspace.yaml       # apps/* + packages/*
├── turbo.json                # 빌드 그래프 + 캐시 설정
├── tsconfig.base.json        # 모든 워크스페이스가 extends
├── .nvmrc                    # 24.15.0
│
├── apps/                     # 배포 단위 (각 앱은 자기 .next/ 산출물)
│   ├── admin/                # softment_admin과 동일 패턴 (CSR-first, features-based)
│   │   ├── package.json      # name: "admin"
│   │   ├── next.config.ts    # transpilePackages: ['@monorepo/ui']
│   │   ├── tsconfig.json     # extends ../../tsconfig.base.json
│   │   └── src/
│   │       ├── app/                          # 라우팅 + layout + providers
│   │       │   ├── (auth)/login/             # public 라우트 그룹
│   │       │   └── (dashboard)/{dashboard,users,users/[id],orders,settings}/
│   │       ├── features/                     # 도메인 슬라이스 (Vertical Slice)
│   │       │   ├── auth/{api,queries,store,hooks,components,pages,types,utils}/
│   │       │   ├── users/  (8개 sub-folder)
│   │       │   └── dashboard/ (9개 sub-folder, sections 포함)
│   │       ├── shared/                       # 도메인 무관 공용
│   │       │   ├── ui/                       # shadcn-style button.tsx
│   │       │   ├── components/               # AlertHost 등
│   │       │   ├── hooks/                    # useAlert 등
│   │       │   ├── utils/                    # cn 등
│   │       │   ├── types/, constants/, styles/ (placeholder)
│   │       ├── libs/                         # 외부 라이브러리 인스턴스 레이어
│   │       │   ├── axios/                    # axios instance
│   │       │   ├── query/                    # QueryClient
│   │       │   ├── dialog/                   # 전역 dialog non-React caller
│   │       │   ├── env/                      # env wrapper
│   │       │   └── router/                   # (placeholder)
│   │       ├── stores/                       # 전역 Zustand (authStore, alertStore)
│   │       ├── styles/globals.css            # Tailwind + shadcn tokens
│   │       ├── middleware.ts                 # 인증 가드 placeholder
│   │       └── types.d.ts                    # NEXT_PUBLIC_* ambient types
│   │
│   └── customer/             # 두 번째 앱 — @monorepo/ui 공유 시연용 (가벼움)
│       └── src/app/...
│
└── packages/                 # 공유 라이브러리 (배포 안 됨, 내부용)
    └── ui/                   # name: "@monorepo/ui"
        ├── package.json      # 양쪽 앱이 "workspace:*"로 참조
        └── src/
            ├── index.ts
            └── Button.tsx    # 두 앱이 공통으로 import
```

각 앱은 자기 `src/` 와 자기 빌드 파이프라인을 가짐. 결과물(`.next/`)도 각자 폴더 안에. **합쳐지지 않음**.

---

## Commands

### 설치 / 빌드 (루트에서)

```bash
pnpm install                       # 워크스페이스 전체 의존성 한 번에 설치
pnpm build                         # 모든 앱 병렬 빌드 (Turborepo cache 적용)
pnpm dev                           # 모든 앱 dev 모드 동시 실행 (persistent)
pnpm lint                          # 모든 앱 lint
pnpm type-check                    # 모든 앱 tsc --noEmit
pnpm clean                         # turbo clean + node_modules 제거
```

### 특정 앱/패키지만 (`--filter`)

```bash
# admin만 빌드
pnpm --filter admin build

# admin만 dev (포트 3000)
pnpm --filter admin dev

# customer만 dev (포트 3001로 설정됨)
pnpm --filter customer dev

# admin과 그가 의존하는 패키지(@monorepo/ui)까지 함께
pnpm --filter admin... build

# packages/ui만
pnpm --filter @monorepo/ui type-check
```

### Turborepo 캐시 동작 확인

```bash
# 1회차 — 처음이라 빌드 실행
pnpm build
# >>> Tasks: 2 successful, 2 total / Cached: 0 cached / Time: ~11s

# 2회차 — 변경 없으면 캐시 hit
pnpm build
# >>> Tasks: 2 successful / Cached: 2 cached / Time: ~22ms  ← FULL TURBO

# admin만 수정 후
pnpm build
# >>> admin은 재빌드, customer는 cached로 통과

# packages/ui 수정 후
pnpm build
# >>> admin, customer 둘 다 재빌드 (다운스트림 그래프 무효화)
```

### 패키지 추가

```bash
# admin에만 새 의존성
pnpm --filter admin add lodash

# 워크스페이스 전체(devDep 공유)
pnpm add -Dw eslint-plugin-foo

# 내부 패키지를 앱에 연결 (이미 admin이 @monorepo/ui를 쓰는 방식)
pnpm --filter admin add @monorepo/ui --workspace
```

---

## Workspace 동작 원리

`apps/admin/package.json`:
```json
"dependencies": {
  "@monorepo/ui": "workspace:*"
}
```

pnpm install 시 `apps/admin/node_modules/@monorepo/ui` → `packages/ui` symlink 생성. 그래서:

```ts
import { Button } from '@monorepo/ui'   // packages/ui/src/index.ts를 그대로 import
```

→ **publish 불필요**. 패키지 코드 수정이 즉시 admin/customer에 반영됨.

Next.js는 기본적으로 외부 패키지를 트랜스파일하지 않으므로 `next.config.ts`에 다음이 필요:
```ts
transpilePackages: ['@monorepo/ui']
```

---

## 공유 디자인 토큰 (`@monorepo/ui/tokens.css`)

여러 앱에서 동일한 컬러 팔레트를 쓰려면 `packages/ui/src/tokens.css`에 한 번 정의하고 각 앱이 import. **TS 상수로 미러링하지 않고 CSS 변수를 그대로 공유**해서 다크모드/멀티브랜드 분기가 자연스럽게 따라옴.

### 구성

```
packages/ui/
├── src/tokens.css     # :root { --gray-50: ... } + @theme inline { --color-gray-50: ... }
└── package.json
    └─ "exports": { "./tokens.css": "./src/tokens.css" }
```

### 각 앱의 사용

```css
/* apps/admin/src/styles/globals.css 그리고 apps/customer/src/styles/globals.css */
@import 'tailwindcss';
@import '@monorepo/ui/tokens.css';   /* ← 이 한 줄로 grayscale 공유 */
@import 'tw-animate-css';

/* 이하 앱 고유 토큰 (semantic, .dark 오버라이드 등) */
```

→ 컴포넌트에선 `bg-gray-100`, `text-gray-700`, `border-gray-200` 등 어디서든 사용 가능. admin과 customer가 같은 grayscale을 공유.

### 현재 정의된 토큰

| 카테고리 | Tailwind 유틸 |
|---|---|
| Grayscale | `bg-gray-50` `bg-gray-100` `bg-gray-200` `bg-gray-300` `bg-gray-400` `bg-gray-500` `bg-gray-600` `bg-gray-700` `bg-gray-800` `bg-gray-900` (text/border 동일) |

semantic 토큰(`bg-primary` 등)은 각 앱의 `globals.css`에서 자유롭게 추가. tokens.css는 **앱 공통의 raw 팔레트만** 담는다.

### 추가/수정 절차

1. `packages/ui/src/tokens.css` 수정 (예: 새 brand color 추가)
2. 빌드 — Turborepo가 tokens.css 변경 감지 → admin/customer 둘 다 재빌드
3. 두 앱에 즉시 반영

---

## 배포 전략 (Vercel 예시)

같은 GitHub 레포를 Vercel에 **여러 프로젝트로 등록**:

```
Vercel Project: admin
├─ Repository: (same repo)
├─ Root Directory: apps/admin
├─ Build Command: cd ../.. && pnpm --filter admin... build
└─ Output Directory: apps/admin/.next

Vercel Project: customer
├─ Repository: (same repo)
├─ Root Directory: apps/customer
├─ Build Command: cd ../.. && pnpm --filter customer... build
└─ Output Directory: apps/customer/.next
```

→ push 시 Vercel이 변경된 폴더를 감지해 해당 프로젝트만 재배포.

---

## 새 앱 추가하기

```bash
# 1. 폴더 + package.json 만들기
mkdir -p apps/staff/src/app
cp -r apps/customer/{tsconfig.json,next.config.ts,postcss.config.mjs,eslint.config.mjs} apps/staff/
# package.json의 name만 "staff"로 수정

# 2. 공유 패키지 연결
cd apps/staff && pnpm add @monorepo/ui --workspace

# 3. 루트에서 install (lockfile 갱신)
cd ../.. && pnpm install

# 4. 빌드 확인
pnpm --filter staff build
```

---

## 새 공유 패키지 추가하기

```bash
# 1. 폴더
mkdir -p packages/utils/src
cat > packages/utils/package.json <<'EOF'
{
  "name": "@monorepo/utils",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
EOF

# 2. 앱에서 사용
pnpm --filter admin add @monorepo/utils --workspace
# admin의 next.config.ts의 transpilePackages에 '@monorepo/utils' 추가

# 3. import
import { formatDate } from '@monorepo/utils'
```

---

## Global Alert / Confirm (apps/admin)

전역 dialog를 어디서든 함수로 호출. softment_admin과 동일 패턴.

### 구성

```
apps/admin/src/stores/alertStore.ts                — Zustand store
apps/admin/src/shared/hooks/useAlert.ts            — React 컴포넌트용 hook
apps/admin/src/libs/dialog/index.ts                — module-level caller (훅 외부 호출용)
apps/admin/src/shared/components/AlertHost.tsx     — base-ui AlertDialog UI
apps/admin/src/app/providers.tsx                   — <AlertHost /> mount됨
```

### 사용 — React 컴포넌트

```tsx
'use client'
import { useAlert } from '@/shared/hooks/useAlert'

export function DeleteButton() {
  const { alert, confirm } = useAlert()

  return (
    <button
      onClick={async () => {
        const ok = await confirm({
          title: '삭제하시겠습니까?',
          description: '되돌릴 수 없습니다.',
          confirmLabel: '삭제',
        })
        if (!ok) return
        // 삭제 로직
        await alert('삭제되었습니다')
      }}
    >
      삭제
    </button>
  )
}
```

### 사용 — 훅 외부 (axios 인터셉터 등)

```ts
import { dialog } from '@/libs/dialog'

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await dialog.alert('세션이 만료되었습니다.')
    }
    return Promise.reject(error)
  }
)
```

### API

```ts
type DialogArg = string | {
  title: string
  description?: string  // \n 줄바꿈 지원
  confirmLabel?: string // 기본 '확인'
  cancelLabel?: string  // 기본 '취소', alert 모드에선 무시
}

useAlert(): {
  alert(arg: DialogArg): Promise<void>
  confirm(arg: DialogArg): Promise<boolean>
}

dialog.alert / dialog.confirm — 동일 시그니처
```

---

## 의존성 정책

루트 `package.json`에 **모든 워크스페이스에 적용할 override** 선언:

```json
"pnpm": {
  "overrides": {
    "postcss": "^8.5.10"
  }
}
```

→ next의 transitive postcss(8.4.31) 등 보안 패치 필요한 경우 한 곳에서 강제. `pnpm audit` 결과가 모든 앱에 동시 반영됨.

---

## Troubleshooting

| 증상 | 원인 / 해결 |
|---|---|
| `Cannot find module '@monorepo/ui'` 빌드 에러 | `next.config.ts`의 `transpilePackages`에 패키지명 추가했는지 확인 |
| 캐시가 hit 안 됨 | Next.js가 빌드 시 `next-env.d.ts`에 한 줄 추가하는 경우가 있어 첫 빌드 후 한 번은 hash 변동. 두 번째 빌드부터 정상 캐시 |
| `pnpm install` 후 변경이 반영 안 됨 | `node_modules/.pnpm` 캐시 문제일 수 있음 → `pnpm clean` 후 재설치 |
| 한 앱만 dev 띄우고 싶음 | `pnpm --filter <app> dev` 사용. 루트 `pnpm dev`는 모든 앱 동시 실행 |

---

## References

- pnpm Workspaces — https://pnpm.io/workspaces
- Turborepo — https://turborepo.com/docs
- Next.js Monorepos — https://nextjs.org/docs/app/guides/transpiling-packages
- shadcn/ui — https://ui.shadcn.com/
- TanStack Query — https://tanstack.com/query/latest
- Zustand — https://zustand.docs.pmnd.rs/
