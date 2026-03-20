"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, LogIn } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    return (
        <header
            style={{
                background: "rgba(252,249,244,0.92)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(218,193,184,0.15)",
            }}
            className="w-full sticky top-0 z-30"
        >
            <nav className="mx-auto flex items-center justify-between px-6 h-16 max-w-7xl">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="Habit Rhythm Logo"
                        width={36}
                        height={36}
                        className="object-contain"
                        priority
                    />
                    <span
                        style={{
                            color: "var(--primary)",
                            fontFamily: "var(--font-headline)",
                        }}
                        className="italic text-xl hidden md:inline"
                    >
                        Habit Rhythm
                    </span>
                </Link>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    {status === "loading" ? null : session ? (
                        <>
                            <span
                                style={{
                                    color: "var(--on-surface-variant)",
                                    fontFamily: "var(--font-body)",
                                }}
                                className="hidden md:inline text-sm"
                            >
                                {session.user?.email}
                            </span>

                            <Link href="/habits">
                                <button
                                    style={{
                                        background: "var(--surface-container)",
                                        color: "var(--primary)",
                                        fontFamily: "var(--font-body)",
                                        borderRadius: "999px",
                                        border: "1px solid rgba(218,193,184,0.3)",
                                    }}
                                    className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity cursor-pointer"
                                >
                                    Tracker
                                </button>
                            </Link>

                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                style={{
                                    color: "var(--on-surface-variant)",
                                    fontFamily: "var(--font-body)",
                                }}
                                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity cursor-pointer"
                                title="Sign out"
                            >
                                <LogOut size={14} />
                                <span className="hidden md:inline">Sign out</span>
                            </button>
                        </>
                    ) : (
                        pathname !== "/login" && (
                            <button
                                onClick={() => router.push("/login")}
                                style={{
                                    background: "var(--primary)",
                                    color: "var(--on-primary)",
                                    fontFamily: "var(--font-body)",
                                    borderRadius: "999px",
                                }}
                                className="flex items-center gap-2 px-5 py-2 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform editorial-shadow cursor-pointer"
                            >
                                <LogIn size={14} />
                                <span>Login</span>
                            </button>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
}
