// src/types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
id?: string | number; 
    email?: string | null;
    name?: string | null;
    companyName?: string;
    image?: string | null;
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user?: {
     id?: string | number; 
      email?: string | null;
      name?: string | null;
      companyName?: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  id?: string | number; 
    email?: string;
    name?: string;
    companyName?: string;
    image?: string;
  }
}
