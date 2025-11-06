![Image](https://github.com/user-attachments/assets/fefae236-c9a5-4712-903c-8626e05861ae)

<div align="center">
  <table style="border:none;">
    <tr>
      <td width="15%" style="border:none;">
        <a href="https://fesi-11-project-ldwd.vercel.app/">
          <img src="https://github.com/user-attachments/assets/e80758a0-1f6f-4bf9-9133-7ca2f320c1c4" alt="Vercel Deploy" width="100%" />
        </a>
      </td>
      <td width="50%" valign="middle" style="border:none; padding-left: 24px;">
        <div align="left">
          <b>유저가 바쁜 일상 속 휴식을 위한 다양한 모임을 탐색하고 참여하며,<br>
          직접 모임을 개설하고 리뷰를 생성할 수 있는 서비스입니다.</b><br><br>
          <b>🛠️ Tech Stack</b><br>
          Next.js 15(App Router) · TypeScript · TanStack Query · NextAuth · shadcn/ui
        </div>
      </td>
    </tr>
  </table>
</div>

---
![Image](https://github.com/user-attachments/assets/fe8cf640-d954-4a0f-94a4-37d5058bd8b2)
| 페이지 | 설명 |
|:--|:--|
| **로그인 / 회원가입** | 이메일·비밀번호·이름·회사명 입력 및 유효성 검사, 실시간 오류 메시지 및 애니메이션 효과 적용 |
| **GNB (내비게이션 바)** | 로고 클릭 시 홈 이동, 찜 개수 표시, 프로필 메뉴(마이페이지·로그아웃) 제공 |
| **모임 목록 페이지 (홈)** | SSR+CSR 기반 무한 스크롤, 필터/정렬, 찜 기능, 로그인 상태별 모임 생성 처리 |
| **모임 상세 페이지** | 참여/취소/공유 기능, 리뷰 확인, 참여 인원 Progress Bar 및 인터랙션 애니메이션 |
| **찜한 모임 페이지** | 웹 스토리지 기반 찜 목록 관리, 클릭 시 색상/크기 변화 애니메이션 |
| **마이페이지** | 프로필 수정, 내가 신청한/만든 모임 및 리뷰 관리, 별점 인터랙션 효과 |
| **모든 리뷰 페이지** | 전체 평점 통계 및 개별 리뷰 조회, 필터/정렬, 무한 스크롤 기반 로딩 |

> ✨ 전반적인 UI에 **Framer Motion**으로 부드러운 전환 및 시각적 피드백 애니메이션을 적용하고
> 
> **Skeleton UI**를 적용하여 레이아웃 시프트 같은 UX까지 고려했습니다. 

---



![Image](https://github.com/user-attachments/assets/e7e8944a-23f1-43da-b05a-c9bddce12f3d)

- **FE**: Next.js 15(App Router), React 18, TypeScript, TailwindCSS, Zod, shadcn/ui, lucide-react
- **상태/데이터**: TanStack Query(무한 스크롤, 캐싱), 커스텀 훅(use-infinite-scroll, use-url-filters 등)
- **인증**: NextAuth
- **테스트**: Jest, React Testing Library, jest-environment-jsdom
- **배포/호스팅**: Vercel
- **번들 분석**: @next/bundle-analyzer

---

![Image](https://github.com/user-attachments/assets/15d46551-bac8-47b8-b104-cd0136cd241c)


### 📦 npm 스크립트
| 단계 | 명령어 | 설명 |
|---|---|---|
| 의존성 설치 | `npm i` |  |
| 개발 서버 실행 | `npm run dev` | http://localhost:3000 |
| 형식/품질 점검(선택) | `npm run lint` / `npm run typecheck` | ESLint / TypeScript 검사 |
| 단위 테스트(선택) | `npm test` | Jest 실행 |
| 프로덕션 빌드 | `npm run build` | 최적화된 빌드 생성 |
| 로컬 프로덕션 실행 | `npm start` | 빌드 산출물 실행 |
---


![Image](https://github.com/user-attachments/assets/fc0ca779-6d7d-49cc-b745-cb301b4b4ad5)
![Image](https://github.com/user-attachments/assets/95a47c5e-7761-4a30-8c48-dcf01202c080)
![Image](https://github.com/user-attachments/assets/f1699691-236d-453e-9a1c-9296aef45431)
