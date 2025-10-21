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
    async jwt({ token, user, trigger, session }) {
      // 최초 로그인 시
      if (user) {
        const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
        
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.companyName = user.companyName;
        token.image = user.image ?? undefined;
        token.expiresAt = expiresAt;
      }

      // update() 메서드로 세션 업데이트 시
      if (trigger === "update" && session) {
        token.name = session.user?.name ?? token.name;
        token.email = session.user?.email ?? token.email;
        token.companyName = session.user?.companyName ?? token.companyName;
        token.image = session.user?.image ?? token.image;
      }

      // 토큰 만료 체크
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now >= token.expiresAt) {
        throw new Error("TOKEN_EXPIRED");
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.accessToken) {
        throw new Error("TOKEN_EXPIRED");
      }

      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.id!,
        email: token.email ?? null,
        name: token.name ?? null,
        companyName: token.companyName,
        image: token.image,
      };
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },

  events: {
    async signOut() {
      // 추가 정리 작업
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions);

export { handler as GET, handler as POST };