// ./src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "next-auth";

interface SigninResponse {
  token: string;
}

interface MeResponse {
  id: number;
  email: string;
  name: string;
  companyName?: string;
  image?: string | null;
}

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
          },
        );

        if (signinRes.status === 404) {
          throw new Error("USER_NOT_FOUND");
        }
        if (signinRes.status === 401) {
          throw new Error("INVALID_PASSWORD");
        }
        if (!signinRes.ok) {
          throw new Error("UNKNOWN_ERROR");
        }

        const signinData = (await signinRes.json()) as SigninResponse;
        const token = signinData?.token;
        if (!token) {
          throw new Error("NO_TOKEN");
        }

        // 2) 토큰으로 내 정보 조회
        const meRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_TEAM_ID}/auths/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!meRes.ok) {
          throw new Error("USER_FETCH_FAILED");
        }

        const me = (await meRes.json()) as MeResponse;

        // NextAuth로 넘길 유저 객체 (확장된 User 타입)
        const user: User = {
          id: me.id,
          email: me.email,
          name: me.name,
          companyName: me.companyName,
          image: me.image ?? null,
          accessToken: token,
        };

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // authorize 직후에는 user가 존재
      if (user) {
        // user는 우리가 확장한 User 타입
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.companyName = user.companyName;
        token.image = user.image ?? undefined;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.id,
        email: token.email ?? null,
        name: token.name ?? null,
        companyName: token.companyName,
        image: token.image,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions);

export { handler as GET, handler as POST };
