import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // 여기서 추가적인 로직 처리 가능
    // 예: 특정 역할 체크, 로그 남기기 등
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 토큰이 있으면 true, 없으면 false
        return !!token;
      },
    },
    pages: {
      signIn: "/login", // 로그인되지 않았을 때 리다이렉트할 페이지
    },
  },
);

export const config = {
  matcher: ["/mypage/:path*"],
};
