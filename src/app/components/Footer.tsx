"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{ background: "var(--surface-container-low)" }}>
            <div className="mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl">
                {/* Brand */}
                <div className="flex flex-col items-center md:items-start gap-1">
                    <span
                        style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                        className="italic text-base"
                    >
                        Habit Rhythm
                    </span>
                    <span
                        style={{ color: "var(--outline)", fontFamily: "var(--font-body)" }}
                        className="text-xs tracking-wide"
                    >
                        © {new Date().getFullYear()} Habit Rhythm. The Living Chronology.
                    </span>
                </div>

                {/* Links */}
                <nav className="flex gap-6 flex-wrap justify-center">
                    {[
                        { label: "GitHub",  href: "https://github.com/frogalo/Habit_Rythm", external: true },
                        { label: "Terms",   href: "/terms",   external: false },
                        { label: "Privacy", href: "/privacy", external: false },
                        { label: "Contact", href: "mailto:support@habitrhythm.com", external: true },
                    ].map(({ label, href, external }) => (
                        external ? (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith("http") ? "_blank" : undefined}
                                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                                style={{
                                    color: "var(--outline)",
                                    fontFamily: "var(--font-body)",
                                    textDecoration: "underline",
                                    textDecorationColor: "var(--outline-variant)",
                                }}
                                className="text-xs tracking-wide hover:opacity-70 transition-opacity"
                            >
                                {label}
                            </a>
                        ) : (
                            <Link
                                key={label}
                                href={href}
                                style={{
                                    color: "var(--outline)",
                                    fontFamily: "var(--font-body)",
                                    textDecoration: "underline",
                                    textDecorationColor: "var(--outline-variant)",
                                }}
                                className="text-xs tracking-wide hover:opacity-70 transition-opacity"
                            >
                                {label}
                            </Link>
                        )
                    ))}
                </nav>
            </div>
        </footer>
    );
}
