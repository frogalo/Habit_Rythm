"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import Link from "next/link";

const testLoginEnabled = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === "true";
const defaultTestEmail = process.env.NEXT_PUBLIC_TEST_USER_EMAIL ?? "";

/* ─── Google SVG (inline, no external image dep) ─── */
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    );
}

/* ─── GitHub SVG ─── */
function GitHubIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
    );
}

/* ─── OAuth social button ─── */
function OAuthButton({
    icon,
    label,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                borderRadius: "0.5rem",
                border: "1px solid rgba(218,193,184,0.4)",
                background: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-body)",
                color: "var(--on-surface-variant)",
                transition: "all 0.3s",
            }}
            className="flex items-center justify-center gap-3 w-full py-4 px-4 hover:bg-white hover:border-[rgba(121,65,36,0.3)] group cursor-pointer"
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "white";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.4)";
            }}
        >
            <span className="flex-shrink-0">{icon}</span>
            <span
                style={{ fontFamily: "var(--font-body)", color: "var(--on-surface-variant)" }}
                className="text-sm font-semibold tracking-tight group-hover:text-[var(--primary)] transition-colors"
            >
                {label}
            </span>
        </button>
    );
}

/* ─── Ghost input field ─── */
function GhostInput({
    id,
    label,
    type,
    placeholder,
    value,
    onChange,
    required,
    rightSlot,
}: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    rightSlot?: React.ReactNode;
}) {
    const [focused, setFocused] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end ml-1">
                <label
                    htmlFor={id}
                    style={{
                        color: "var(--outline)",
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.25em",
                    }}
                    className="uppercase font-bold"
                >
                    {label}
                </label>
                {rightSlot}
            </div>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: focused
                        ? "1px solid var(--primary)"
                        : "1px solid rgba(218,193,184,0.5)",
                    borderRadius: 0,
                    padding: "14px 4px",
                    outline: "none",
                    fontFamily: "var(--font-body)",
                    color: "var(--on-surface)",
                    fontSize: "1rem",
                    transition: "border-color 0.3s",
                    width: "100%",
                    boxShadow: focused ? "0 2px 0 -1px rgba(139,79,49,0.15)" : "none",
                }}
                placeholder-color="rgba(218,193,184,0.4)"
            />
        </div>
    );
}

/* ─── Page ─── */
export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState(defaultTestEmail);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTestForm, setShowTestForm] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/habits");
        }
    }, [status, router]);

    async function handleTestLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/habits",
        });

        setIsSubmitting(false);

        if (result?.error) {
            setErrorMessage("Invalid credentials. Please try again.");
            return;
        }

        router.replace(result?.url ?? "/habits");
    }

    if (status === "loading") {
        return (
            <div
                style={{ background: "var(--background)", minHeight: "100vh" }}
                className="flex items-center justify-center"
            >
                <span
                    style={{ color: "var(--outline)", fontFamily: "var(--font-body)" }}
                    className="text-xs uppercase tracking-widest animate-pulse"
                >
                    Loading…
                </span>
            </div>
        );
    }

    return (
        <div
            style={{ background: "var(--background)", minHeight: "100vh" }}
            className="flex flex-col items-center justify-center p-6 relative"
        >
            {/* ── Ambient blobs ── */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden -z-10"
                aria-hidden="true"
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        left: "-10%",
                        width: "50%",
                        height: "50%",
                        background: "rgba(222,226,200,0.15)",
                        borderRadius: "50%",
                        filter: "blur(120px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        right: "-10%",
                        width: "60%",
                        height: "60%",
                        background: "rgba(150,88,57,0.10)",
                        borderRadius: "50%",
                        filter: "blur(150px)",
                    }}
                />
            </div>

            {/* ── Grain overlay ── */}
            <div
                className="grain-texture fixed inset-0 pointer-events-none -z-20 mix-blend-multiply"
                style={{ opacity: 0.03 }}
                aria-hidden="true"
            />

            <main className="w-full max-w-[460px] z-10 flex flex-col items-center">

                {/* ── Brand header ── */}
                <header className="text-center mb-12">
                    <Link href="/">
                        <h1
                            style={{
                                color: "var(--primary)",
                                fontFamily: "var(--font-headline)",
                                fontSize: "3.75rem",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.05,
                            }}
                            className="italic mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            Habit Rhythm
                        </h1>
                    </Link>
                    <p
                        style={{
                            color: "var(--outline)",
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            letterSpacing: "0.4em",
                        }}
                        className="uppercase font-semibold"
                    >
                        The Living Chronology
                    </p>
                </header>

                {/* ── Card ── */}
                <div
                    style={{
                        width: "100%",
                        background: "var(--surface-container-low)",
                        borderRadius: "2rem",
                        boxShadow: "0 48px 80px -24px rgba(121,65,36,0.06)",
                        border: "1px solid rgba(218,193,184,0.3)",
                        padding: "2.5rem",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {session ? (
                        /* ── Already signed in state ── */
                        <div className="flex flex-col items-center gap-6 text-center py-4">
                            <div>
                                <h2
                                    style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                                    className="text-3xl mb-2"
                                >
                                    Welcome back
                                </h2>
                                <p
                                    style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                                    className="text-sm"
                                >
                                    Signed in as{" "}
                                    <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                                        {session.user?.email}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 w-full">
                                <Link href="/habits" className="w-full">
                                    <button
                                        style={{
                                            background: "var(--primary)",
                                            color: "var(--on-primary)",
                                            fontFamily: "var(--font-body)",
                                            borderRadius: "0.75rem",
                                            width: "100%",
                                        }}
                                        className="py-4 font-bold text-xs uppercase tracking-[0.3em] hover:opacity-90 transition-opacity editorial-shadow cursor-pointer"
                                    >
                                        Open Tracker
                                    </button>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    style={{
                                        color: "var(--outline)",
                                        fontFamily: "var(--font-body)",
                                        border: "1px solid rgba(218,193,184,0.3)",
                                        borderRadius: "0.75rem",
                                    }}
                                    className="flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity cursor-pointer w-full"
                                >
                                    <LogOut size={14} />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ── Card headline ── */}
                            <div className="mb-10 text-center">
                                <h2
                                    style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                                    className="text-4xl mb-3"
                                >
                                    Welcome Back
                                </h2>
                                <p
                                    style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                                    className="text-sm leading-relaxed max-w-[280px] mx-auto"
                                >
                                    Return to your curated sanctuary of reflection.
                                </p>
                            </div>

                            {/* ── OAuth buttons ── */}
                            <div className="flex flex-col gap-3 mb-10">
                                <OAuthButton
                                    icon={<GoogleIcon />}
                                    label="Continue with Google"
                                    onClick={() => signIn("google")}
                                />
                                <OAuthButton
                                    icon={<GitHubIcon />}
                                    label="Continue with GitHub"
                                    onClick={() => signIn("github")}
                                />
                            </div>

                            {/* ── Divider ── */}
                            <div className="relative flex items-center mb-10">
                                <div
                                    style={{ borderTop: "1px solid rgba(218,193,184,0.25)" }}
                                    className="flex-grow"
                                />
                                <span
                                    style={{
                                        color: "var(--outline)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "10px",
                                        letterSpacing: "0.25em",
                                    }}
                                    className="flex-shrink mx-6 uppercase font-bold"
                                >
                                    or use email
                                </span>
                                <div
                                    style={{ borderTop: "1px solid rgba(218,193,184,0.25)" }}
                                    className="flex-grow"
                                />
                            </div>

                            {/* ── Credentials form ── */}
                            <form onSubmit={handleTestLogin} className="flex flex-col gap-8">
                                <GhostInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={setEmail}
                                    required
                                />

                                <GhostInput
                                    id="password"
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={setPassword}
                                    required
                                    rightSlot={
                                        <a
                                            href="#"
                                            style={{
                                                color: "var(--primary)",
                                                fontFamily: "var(--font-body)",
                                                fontSize: "10px",
                                                letterSpacing: "0.2em",
                                            }}
                                            className="uppercase font-bold hover:opacity-70 transition-opacity"
                                        >
                                            Forgot?
                                        </a>
                                    }
                                />

                                {/* Error message */}
                                {errorMessage && (
                                    <div
                                        style={{
                                            background: "var(--error-container)",
                                            color: "var(--on-error-container)",
                                            borderRadius: "0.5rem",
                                            fontFamily: "var(--font-body)",
                                        }}
                                        className="px-4 py-3 text-sm"
                                    >
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        style={{
                                            background: "var(--primary)",
                                            color: "var(--on-primary)",
                                            fontFamily: "var(--font-body)",
                                            borderRadius: "0.75rem",
                                            width: "100%",
                                            boxShadow: "0 20px 40px -12px rgba(121,65,36,0.25)",
                                        }}
                                        className="py-5 font-bold text-xs uppercase tracking-[0.3em] hover:opacity-90 active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSubmitting ? "Signing in…" : "Sign In"}
                                    </button>
                                </div>
                            </form>

                            {/* ── Test-user mode toggle ── */}
                            {testLoginEnabled && (
                                <div
                                    style={{ borderTop: "1px solid rgba(218,193,184,0.1)" }}
                                    className="mt-12 pt-8 text-center"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setShowTestForm((p) => !p)}
                                        style={{
                                            background: "rgba(255,255,255,0.3)",
                                            border: "1px solid rgba(218,193,184,0.2)",
                                            borderRadius: "999px",
                                            fontFamily: "var(--font-body)",
                                        }}
                                        className="inline-flex items-center gap-2.5 px-6 py-2.5 hover:border-[rgba(134,55,28,0.4)] transition-all duration-300 cursor-pointer"
                                    >
                                        <span
                                            style={{
                                                width: "6px",
                                                height: "6px",
                                                borderRadius: "50%",
                                                background: "var(--tertiary)",
                                                boxShadow: "0 0 8px rgba(134,55,28,0.4)",
                                                display: "inline-block",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <span
                                            style={{
                                                color: "var(--tertiary)",
                                                fontFamily: "var(--font-body)",
                                                fontSize: "10px",
                                                letterSpacing: "0.2em",
                                            }}
                                            className="font-bold uppercase"
                                        >
                                            Quick Entry: Test-User Mode
                                        </span>
                                    </button>

                                    {/* Expandable credentials panel */}
                                    {showTestForm && (
                                        <div
                                            style={{
                                                marginTop: "1rem",
                                                background: "rgba(255,255,255,0.4)",
                                                border: "1px solid rgba(218,193,184,0.2)",
                                                borderRadius: "0.5rem",
                                                padding: "1rem",
                                            }}
                                            className="text-left flex flex-col gap-3"
                                        >
                                            <p
                                                style={{
                                                    color: "var(--on-surface-variant)",
                                                    fontFamily: "var(--font-body)",
                                                    fontSize: "11px",
                                                }}
                                                className="text-center"
                                            >
                                                Fill in your test credentials above and hit{" "}
                                                <strong>Sign In</strong>.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ── Below-card footer ── */}
                {!session && (
                    <footer className="mt-12 flex flex-col items-center gap-8">
                        <p
                            style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                            className="text-sm"
                        >
                            New to the rhythm?{" "}
                            <a
                                href="#"
                                style={{ color: "var(--primary)", fontWeight: 700 }}
                                className="hover:underline underline-offset-4 ml-1"
                            >
                                Begin Journaling
                            </a>
                        </p>
                        <nav className="flex gap-10">
                            {[
                                { label: "Privacy",    href: "/privacy" },
                                { label: "Philosophy", href: "/#philosophy" },
                                { label: "Support",    href: "mailto:support@habitrhythm.com" },
                            ].map(({ label, href }) => (
                                <a
                                    key={label}
                                    href={href}
                                    style={{
                                        color: "var(--outline)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "10px",
                                        letterSpacing: "0.25em",
                                    }}
                                    className="uppercase font-bold hover:opacity-70 transition-opacity"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </footer>
                )}
            </main>
        </div>
    );
}
