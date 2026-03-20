import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            permissions: string[];
        };
    }

    interface User {
        permissions?: string[];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        permissions?: string[];
    }
}
