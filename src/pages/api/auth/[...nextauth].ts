import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type { Prisma } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import {
    buildMockHabits,
    getMockUserConfig,
    normalizePermissions,
} from "@/features/auth/mockUser";

type ExistingUserRecord = {
    id: string;
    provider: string[];
    permissions: string[];
    googleProfile: Prisma.JsonValue | null;
    githubProfile: Prisma.JsonValue | null;
    habits: Array<{ id: string }>;
};

type UserData = {
    name?: string;
    email: string;
    image?: string;
    provider: string[];
    permissions: string[];
    givenName?: string;
    familyName?: string;
    locale?: string;
    login?: string;
    githubId?: string;
    githubImage?: string;
    googleImage?: string;
    githubProfile?: Prisma.InputJsonValue;
    googleProfile?: Prisma.InputJsonValue;
};

function normalizeProviders(value: string[] | undefined): string[] {
    return Array.isArray(value) ? value : [];
}

function normalizePermissionField(value: string[] | undefined): string[] {
    return Array.isArray(value) ? normalizePermissions(value) : [];
}

function toJsonValue(value: unknown): Prisma.InputJsonValue | undefined {
    if (value === undefined) {
        return undefined;
    }

    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function buildMockHabitCreateInput() {
    return buildMockHabits().map((habit) => ({
        name: habit.name,
        color: habit.color,
        completions: {
            create: habit.completions.map((date) => ({ date })),
        },
    }));
}

const mockUserConfig = getMockUserConfig();
const githubConfigured =
    !!process.env.GITHUB_ID?.trim() && !!process.env.GITHUB_SECRET?.trim();
const googleConfigured =
    !!process.env.GOOGLE_CLIENT_ID?.trim() &&
    !!process.env.GOOGLE_CLIENT_SECRET?.trim();

export const authOptions: NextAuthOptions = {
    providers: [
        ...(githubConfigured
            ? [
                  GithubProvider({
                      clientId: process.env.GITHUB_ID!,
                      clientSecret: process.env.GITHUB_SECRET!,
                  }),
              ]
            : []),
        ...(googleConfigured
            ? [
                  GoogleProvider({
                      clientId: process.env.GOOGLE_CLIENT_ID!,
                      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                  }),
              ]
            : []),
        ...(mockUserConfig.enabled
            ? [
                  CredentialsProvider({
                      name: "Test User",
                      credentials: {
                          email: { label: "Email", type: "email" },
                          password: { label: "Password", type: "password" },
                      },
                      async authorize(credentials) {
                          const email = credentials?.email?.trim() ?? "";
                          const password = credentials?.password?.trim() ?? "";

                          if (
                              email !== mockUserConfig.email ||
                              password !== mockUserConfig.password
                          ) {
                              return null;
                          }

                          return {
                              id: mockUserConfig.email,
                              email: mockUserConfig.email,
                              name: mockUserConfig.name,
                              permissions: mockUserConfig.permissions,
                          };
                      },
                  }),
              ]
            : []),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (!user.email) {
                    console.error("No email found for user, cannot sign in.");
                    return false;
                }

                const existingUser = (await prisma.user.findUnique({
                    where: { email: user.email },
                    include: {
                        habits: {
                            select: {
                                id: true,
                            },
                        },
                    },
                })) as ExistingUserRecord | null;

                const providerList = normalizeProviders(existingUser?.provider);

                if (account?.provider) {
                    providerList.push(account.provider);
                }

                const isMockUser =
                    account?.provider === "credentials" &&
                    user.email === mockUserConfig.email;
                const permissions = isMockUser
                    ? mockUserConfig.permissions
                    : normalizePermissionField(existingUser?.permissions);

                const userData: UserData = {
                    name: user.name ?? undefined,
                    email: user.email,
                    image: user.image ?? undefined,
                    provider: Array.from(new Set(providerList)),
                    permissions,
                    googleProfile:
                        toJsonValue(existingUser?.googleProfile) ?? undefined,
                    githubProfile:
                        toJsonValue(existingUser?.githubProfile) ?? undefined,
                };

                if (account?.provider === "google") {
                    userData.givenName =
                        ((profile as Record<string, unknown>)?.given_name as string) ??
                        undefined;
                    userData.familyName =
                        ((profile as Record<string, unknown>)?.family_name as string) ??
                        undefined;
                    userData.locale =
                        ((profile as Record<string, unknown>)?.locale as string) ??
                        undefined;
                    userData.googleProfile = toJsonValue(profile);
                    userData.googleImage = user.image ?? undefined;
                }

                if (account?.provider === "github") {
                    userData.login =
                        ((profile as Record<string, unknown>)?.login as string) ??
                        undefined;
                    userData.githubId = (profile as Record<string, unknown>)?.id
                        ? String((profile as Record<string, unknown>).id)
                        : undefined;
                    userData.githubProfile = toJsonValue(profile);
                    userData.githubImage = user.image ?? undefined;
                }

                const baseData = {
                    name: userData.name,
                    email: userData.email,
                    image: userData.image,
                    provider: userData.provider,
                    permissions: userData.permissions,
                    givenName: userData.givenName,
                    familyName: userData.familyName,
                    locale: userData.locale,
                    login: userData.login,
                    githubId: userData.githubId,
                    githubImage: userData.githubImage,
                    googleImage: userData.googleImage,
                    githubProfile: userData.githubProfile,
                    googleProfile: userData.googleProfile,
                };

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            ...baseData,
                            habits: isMockUser
                                ? {
                                      create: buildMockHabitCreateInput(),
                                  }
                                : undefined,
                        },
                    });
                } else {
                    await prisma.user.update({
                        where: { email: user.email },
                        data: baseData,
                    });

                    if (isMockUser && existingUser.habits.length === 0) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                habits: {
                                    create: buildMockHabitCreateInput(),
                                },
                            },
                        });
                    }
                }

                return true;
            } catch (error) {
                console.error("Prisma user upsert error:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (!token.email && !user?.email) {
                return token;
            }

            if (user?.permissions) {
                token.permissions = user.permissions;
                return token;
            }

            if (!token.permissions?.length) {
                const email = user?.email ?? token.email;

                if (!email) {
                    return token;
                }

                const dbUser = await prisma.user.findUnique({
                    where: { email },
                    select: {
                        permissions: true,
                    },
                });

                token.permissions = normalizePermissionField(dbUser?.permissions);
            }

            return token;
        },
        async session({ session, token }) {
            session.user.permissions = normalizePermissions(token.permissions);
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url === baseUrl || url === `${baseUrl}/login`) {
                return `${baseUrl}/habits`;
            }

            return url;
        },
    },
};

export default NextAuth(authOptions);
