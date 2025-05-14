import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Always redirect to /habits after login
            // Only override if the url is the base or login page
            if (url === baseUrl || url === `${baseUrl}/login`) {
                return `${baseUrl}/habits`;
            }
            return url;
        },
    },
};

export default NextAuth(authOptions);
