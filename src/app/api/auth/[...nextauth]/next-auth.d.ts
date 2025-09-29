import "next-auth";
import "next-auth/jwt";

// Session 타입 확장
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id?: number;
      email?: string | null;
      name?: string | null;
      companyName?: string;
      image?: string | null;
    };
  }
}

// JWT 타입 확장
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    id?: number;
    email?: string;
    name?: string;
    companyName?: string;
    image?: string;
  }
}
