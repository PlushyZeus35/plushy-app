import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    jwt?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User extends DefaultUser {
    jwt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt?: string;
    id?: string;
  }
}