import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // 1) 로그인 요청
        const signinRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}/auths/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        // 상태 코드별 처리
        if (signinRes.status === 404) {
          return Promise.reject(new Error("USER_NOT_FOUND"));
        }
        if (signinRes.status === 401) {
          return Promise.reject(new Error("INVALID_PASSWORD"));
        }
        if (!signinRes.ok) {
          return Promise.reject(new Error("UNKNOWN_ERROR"));
        }

        const signinData = await signinRes.json();
        const token = signinData?.token as string | undefined;
        if (!token) {
          return Promise.reject(new Error("NO_TOKEN"));
        }

        // 2) 토큰으로 내 정보 조회
        const meRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}/auths/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!meRes.ok) {
          return Promise.reject(new Error("USER_FETCH_FAILED"));
        }

        const me = await meRes.json();

        // NextAuth로 넘길 유저 객체
        return {
          id: me.id,
          email: me.email,
          name: me.name,
          companyName: me.companyName,
          image: me.image,
          token,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token;
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        (token as any).companyName = (user as any).companyName;
        (token as any).image = (user as any).image;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user = {
        ...session.user,
        id: token.id as number | undefined,
        email: token.email as string | null | undefined,
        name: token.name as string | null | undefined,
        companyName: (token as any).companyName as string | undefined,
        image: (token as any).image as string | undefined,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
