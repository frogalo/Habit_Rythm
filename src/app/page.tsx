"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sub-components                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */

function GrainOverlay() {
    return (
        <div
            className="grain-texture fixed inset-0 z-[60] pointer-events-none"
            aria-hidden="true"
        />
    );
}

function TopBar() {
    const router = useRouter();
    const { data: session, status } = useSession();

    return (
        <header
            style={{ background: "var(--surface)" }}
            className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 md:px-12"
        >
            {/* Left: brand + nav */}
            <div className="flex items-center gap-8">
                <Link href="/">
                    <h1
                        style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                        className="italic text-2xl cursor-pointer"
                    >
                        Habit Rhythm
                    </h1>
                </Link>

                <nav className="hidden md:flex gap-8">
                    {[
                        { label: "Philosophy", href: "#philosophy", active: true },
                        { label: "Features",   href: "#features",   active: false },
                        { label: "Community",  href: "#cta",        active: false },
                    ].map(({ label, href, active }) => (
                        <a
                            key={label}
                            href={href}
                            style={{
                                color: active ? "var(--primary)" : "var(--outline)",
                                borderBottom: active
                                    ? "2px solid var(--primary)"
                                    : "2px solid transparent",
                                fontFamily: "var(--font-body)",
                            }}
                            className="text-[10px] uppercase tracking-widest font-bold pb-1 transition-colors duration-300 hover:opacity-80"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Right: auth action */}
            <div className="flex items-center gap-3">
                {status !== "loading" && (
                    session ? (
                        <Link href="/habits">
                            <button
                                style={{
                                    background: "var(--primary)",
                                    color: "var(--on-primary)",
                                    fontFamily: "var(--font-body)",
                                    borderRadius: "999px",
                                }}
                                className="px-5 py-2 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 editorial-shadow cursor-pointer"
                            >
                                Open App
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={() => router.push("/login")}
                            style={{
                                background: "var(--primary)",
                                color: "var(--on-primary)",
                                fontFamily: "var(--font-body)",
                                borderRadius: "999px",
                            }}
                            className="px-5 py-2 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 editorial-shadow cursor-pointer"
                        >
                            Sign In
                        </button>
                    )
                )}
            </div>
        </header>
    );
}

/** Habit preview card shown in hero */
function HabitPreviewCard() {
    const total = 21;
    const doneIndexes = new Set([0,1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18]);

    return (
        <div
            style={{
                background: "var(--surface-container-lowest)",
                border: "1px solid rgba(218,193,184,0.12)",
                borderRadius: "0.5rem",
            }}
            className="relative p-8 editorial-shadow"
        >
            {/* glow */}
            <div
                style={{
                    background: "var(--primary-fixed)",
                    borderRadius: "2rem",
                    filter: "blur(40px)",
                }}
                className="absolute -inset-4 opacity-20 group-hover:opacity-30 transition-all duration-700 -z-10"
                aria-hidden="true"
            />

            {/* Card header */}
            <div className="flex justify-between items-end mb-12">
                <div>
                    <span
                        style={{ color: "var(--secondary)", fontFamily: "var(--font-body)" }}
                        className="text-[10px] uppercase tracking-widest font-bold block"
                    >
                        Daily Ritual
                    </span>
                    <h3
                        style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                        className="text-4xl italic mt-2"
                    >
                        Morning Reflection
                    </h3>
                </div>
                <div className="text-right">
                    <span
                        style={{ color: "var(--tertiary)", fontFamily: "var(--font-headline)" }}
                        className="text-5xl font-medium"
                    >
                        14
                    </span>
                    <span
                        style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                        className="text-[10px] uppercase tracking-widest font-bold block"
                    >
                        Day Streak
                    </span>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: total }).map((_, i) => {
                    const done = doneIndexes.has(i);
                    const fade = done && i < 3 ? 0.15 + i * 0.1 : 1;
                    return (
                        <div
                            key={i}
                            style={{
                                background: done ? "var(--primary)" : "var(--surface-container-high)",
                                opacity: done ? fade : 1,
                                borderRadius: "0.125rem",
                                aspectRatio: "1 / 1",
                            }}
                            className="transition-all duration-300"
                        />
                    );
                })}
            </div>

            {/* Footer row */}
            <div
                style={{ borderTop: "1px solid rgba(218,193,184,0.05)" }}
                className="mt-8 flex items-center justify-between pt-6"
            >
                <div className="flex gap-2">
                    {[
                        "var(--secondary)",
                        "var(--surface-container-high)",
                        "var(--surface-container-high)",
                    ].map((c, i) => (
                        <span
                            key={i}
                            style={{ background: c, display: "inline-block" }}
                            className="w-2 h-2 rounded-full"
                        />
                    ))}
                </div>
                <span
                    style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                    className="text-[9px] uppercase tracking-widest font-bold italic"
                >
                    Visualizing momentum…
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sections                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */

function HeroSection() {
    const router = useRouter();

    return (
        <section className="relative px-6 py-20 md:py-36 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
            {/* Left copy */}
            <motion.div
                className="w-full md:w-1/2 flex flex-col items-start gap-8 z-10"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {/* Eyebrow */}
                <div
                    style={{
                        background: "rgba(222,226,200,0.3)",
                        border: "1px solid rgba(218,193,184,0.12)",
                        borderRadius: "999px",
                    }}
                    className="inline-block px-4 py-1.5"
                >
                    <span
                        style={{ color: "var(--on-secondary-container)", fontFamily: "var(--font-body)" }}
                        className="text-xs uppercase tracking-[0.2em] font-bold"
                    >
                        The Living Chronology
                    </span>
                </div>

                {/* Headline */}
                <h2
                    style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                    className="text-6xl md:text-8xl font-medium tracking-tight leading-[1.1]"
                >
                    Track your habits with{" "}
                    <span className="italic">intention.</span>
                </h2>

                {/* Sub-copy */}
                <p
                    style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                    className="text-lg md:text-xl max-w-lg leading-relaxed"
                >
                    A digital sanctuary designed for calm momentum. We reject the noise
                    of traditional trackers for a rhythmic, editorial approach to personal
                    growth.
                </p>

                {/* CTAs */}
                <div className="flex gap-4 items-center flex-wrap">
                    <button
                        onClick={() => router.push("/login")}
                        style={{
                            background: "var(--primary)",
                            color: "var(--on-primary)",
                            fontFamily: "var(--font-body)",
                            borderRadius: "999px",
                        }}
                        className="px-8 py-4 font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform editorial-shadow cursor-pointer"
                    >
                        Start your journey today
                    </button>
                    <a
                        href="#philosophy"
                        style={{
                            color: "var(--primary)",
                            fontFamily: "var(--font-body)",
                            textDecoration: "underline",
                            textDecorationColor: "var(--outline-variant)",
                        }}
                        className="px-8 py-4 bg-transparent font-bold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity"
                    >
                        Our Philosophy
                    </a>
                </div>
            </motion.div>

            {/* Right: preview card */}
            <motion.div
                className="w-full md:w-1/2 relative group"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
                <HabitPreviewCard />
            </motion.div>
        </section>
    );
}

function PhilosophySection() {
    return (
        <section
            id="philosophy"
            style={{ background: "var(--surface-container-low)" }}
            className="py-24 px-6"
        >
            <div className="max-w-5xl mx-auto text-center flex flex-col gap-8">
                <span
                    style={{ color: "var(--tertiary)", fontFamily: "var(--font-body)" }}
                    className="text-xs uppercase tracking-[0.3em] font-bold"
                >
                    Product Story
                </span>

                <h3
                    style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                    className="text-5xl md:text-6xl leading-tight"
                >
                    Beyond numbers.
                    <br />
                    Toward{" "}
                    <span className="italic" style={{ color: "var(--tertiary)" }}>
                        visual harmony.
                    </span>
                </h3>

                <div className="grid md:grid-cols-2 gap-12 mt-12 text-left">
                    {[
                        {
                            icon: "spa",
                            title: "Calm Momentum",
                            body: "We believe tracking shouldn't feel like a chore. Our interface mimics the soft texture of stone and paper to ground your daily progress.",
                            accent: "var(--primary)",
                        },
                        {
                            icon: "analytics",
                            title: "Visual Progress",
                            body: "Data transformed into art. Watch your habits weave a tapestry of consistency through our signature rhythmic grids.",
                            accent: "var(--secondary)",
                        },
                    ].map(({ icon, title, body, accent }) => (
                        <motion.div
                            key={title}
                            style={{
                                background: "var(--surface-container-lowest)",
                                borderRadius: "0.5rem",
                            }}
                            className="flex flex-col gap-4 p-8"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                className="material-symbols-outlined"
                                style={{ color: accent, fontSize: "2.5rem" }}
                            >
                                {icon}
                            </span>
                            <h4
                                style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                                className="text-2xl"
                            >
                                {title}
                            </h4>
                            <p style={{ color: "var(--on-surface-variant)" }} className="leading-relaxed">
                                {body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section id="features" className="px-6 py-24 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-12 gap-6">
                {/* Daily Ritual — wide top */}
                <motion.div
                    style={{
                        background: "var(--surface-container-low)",
                        borderRadius: "0.5rem",
                    }}
                    className="md:col-span-8 p-12 flex flex-col justify-center relative overflow-hidden group min-h-[300px]"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="relative z-10 flex flex-col gap-6 max-w-md">
                        <span
                            style={{ color: "var(--primary)", fontFamily: "var(--font-body)" }}
                            className="text-xs uppercase tracking-widest font-bold"
                        >
                            Focus One
                        </span>
                        <h4
                            style={{ color: "var(--on-background)", fontFamily: "var(--font-headline)" }}
                            className="text-5xl italic"
                        >
                            Daily Ritual
                        </h4>
                        <p style={{ color: "var(--on-surface-variant)" }}>
                            The morning sets the tone. Our focused ritual interface minimises
                            distractions to help you prioritise your most grounding habits
                            before the day begins.
                        </p>
                    </div>
                    {/* decorative icon */}
                    <div
                        className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-[0.07] group-hover:scale-110 transition-transform duration-[1200ms]"
                        aria-hidden="true"
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{ color: "var(--primary)", fontSize: "20rem", lineHeight: 1 }}
                        >
                            wb_sunny
                        </span>
                    </div>
                </motion.div>

                {/* Weekly Rhythm — tall right column spanning 2 rows */}
                <motion.div
                    style={{
                        background: "var(--primary)",
                        color: "var(--on-primary)",
                        borderRadius: "0.5rem",
                    }}
                    className="md:col-span-4 md:row-span-2 p-12 flex flex-col gap-8 relative overflow-hidden min-h-[300px]"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    <span
                        style={{ color: "var(--primary-fixed-dim)", fontFamily: "var(--font-body)" }}
                        className="text-xs uppercase tracking-widest font-bold"
                    >
                        Focus Two
                    </span>
                    <h4
                        style={{ fontFamily: "var(--font-headline)" }}
                        className="text-5xl italic leading-tight"
                    >
                        Weekly Rhythm
                    </h4>
                    <p style={{ color: "var(--on-primary-container)" }} className="text-lg">
                        Understand your ebb and flow. Our weekly visualisation reveals
                        patterns you didn&apos;t know existed, allowing you to adjust with
                        grace.
                    </p>
                    <div className="mt-auto flex flex-col gap-4">
                        {[0.75, 0.5, 0.85].map((w, i) => (
                            <div
                                key={i}
                                style={{
                                    background: "rgba(255,182,147,0.2)",
                                    borderRadius: "999px",
                                    height: "4px",
                                }}
                                className="w-full overflow-hidden"
                            >
                                <div
                                    style={{
                                        width: `${w * 100}%`,
                                        background: "var(--primary-fixed-dim)",
                                        height: "100%",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Monthly Insight — wide bottom */}
                <motion.div
                    style={{
                        background: "var(--secondary-container)",
                        borderRadius: "0.5rem",
                    }}
                    className="md:col-span-8 p-12 flex flex-col md:flex-row gap-12 items-center min-h-[300px]"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                >
                    <div className="flex flex-col gap-6 flex-1">
                        <span
                            style={{ color: "var(--secondary)", fontFamily: "var(--font-body)" }}
                            className="text-xs uppercase tracking-widest font-bold"
                        >
                            Focus Three
                        </span>
                        <h4
                            style={{ color: "var(--on-background)", fontFamily: "var(--font-headline)" }}
                            className="text-5xl italic"
                        >
                            Monthly Insight
                        </h4>
                        <p style={{ color: "var(--on-secondary-container)" }}>
                            Deep reflection for long-term growth. Every month, receive a
                            curated journal entry summarising your personal evolution.
                        </p>
                    </div>
                    {/* Glassmorphism mini card */}
                    <div
                        style={{
                            background: "rgba(255,255,255,0.5)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: "0.5rem",
                        }}
                        className="w-full md:w-1/3 p-6 editorial-shadow flex-shrink-0"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                style={{
                                    background: "rgba(134,55,28,0.15)",
                                    color: "var(--tertiary)",
                                    borderRadius: "999px",
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: "1.25rem" }}
                                >
                                    auto_stories
                                </span>
                            </div>
                            <span
                                style={{ fontFamily: "var(--font-body)", color: "var(--on-surface)" }}
                                className="text-[10px] font-bold uppercase tracking-widest"
                            >
                                Reflection log
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {[100, 83, 66].map((w, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: "8px",
                                        background: "rgba(96,101,80,0.12)",
                                        borderRadius: "999px",
                                        width: `${w}%`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function CtaSection() {
    const router = useRouter();

    return (
        <section
            id="cta"
            style={{ background: "var(--surface)" }}
            className="py-32 px-6 text-center relative overflow-hidden"
        >
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
                <motion.h2
                    style={{ color: "var(--primary)", fontFamily: "var(--font-headline)" }}
                    className="text-6xl md:text-8xl leading-tight font-medium"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    Begin your{" "}
                    <span className="italic">masterpiece.</span>
                </motion.h2>

                <motion.p
                    style={{ color: "var(--on-surface-variant)", fontFamily: "var(--font-body)" }}
                    className="text-xl max-w-xl"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Join 50,000+ souls tracking their days with intention. Experience the
                    interface that feels like a quiet room.
                </motion.p>

                <motion.button
                    onClick={() => router.push("/login")}
                    style={{
                        background: "var(--primary)",
                        color: "var(--on-primary)",
                        fontFamily: "var(--font-body)",
                        borderRadius: "999px",
                    }}
                    className="px-12 py-5 font-bold text-base tracking-widest uppercase editorial-shadow cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Start your journey today
                </motion.button>

                {/* <span
                    style={{ color: "var(--outline)", fontFamily: "var(--font-body)" }}
                    className="text-[10px] uppercase tracking-[0.4em] font-bold"
                >
                    Free for 14 days • No credit card required
                </span> */}
            </div>
        </section>
    );
}

function SiteFooter() {
    return (
        <footer style={{ background: "var(--surface-container-low)" }}>
            <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <h5
                        style={{ color: "var(--on-surface)", fontFamily: "var(--font-headline)" }}
                        className="italic text-lg"
                    >
                        Habit Rhythm
                    </h5>
                    <p
                        style={{ color: "var(--outline)", fontFamily: "var(--font-body)" }}
                        className="text-xs tracking-wide"
                    >
                        © 2025 Habit Rhythm. The Living Chronology.
                    </p>
                </div>
                <nav className="flex gap-8 flex-wrap justify-center">
                    {[
                        { label: "Philosophy", href: "#philosophy" },
                        { label: "Privacy",    href: "/privacy" },
                        { label: "Terms",      href: "/terms" },
                        { label: "GitHub",     href: "https://github.com/frogalo/Habit_Rythm" },
                    ].map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            style={{
                                color: "var(--outline)",
                                fontFamily: "var(--font-body)",
                                textDecoration: "underline",
                                textDecorationColor: "var(--outline-variant)",
                            }}
                            className="text-xs tracking-wide hover:opacity-70 transition-opacity"
                            target={href.startsWith("http") ? "_blank" : undefined}
                            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </footer>
    );
}

function MobileBottomNav() {
    const items = [
        { icon: "auto_stories", label: "Journal" },
        { icon: "replay",       label: "Rhythm" },
        { icon: "analytics",    label: "Insights" },
        { icon: "spa",          label: "Sanctuary" },
    ];

    return (
        <div
            style={{
                background: "rgba(252,249,244,0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(218,193,184,0.2)",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.02)",
            }}
            className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3"
        >
            {items.map(({ icon, label }, i) => (
                <button
                    key={label}
                    style={{
                        color: i === 0 ? "var(--primary)" : "var(--outline)",
                        background:
                            i === 0 ? "rgba(196,201,176,0.3)" : "transparent",
                        borderRadius: "999px",
                        fontFamily: "var(--font-body)",
                    }}
                    className="flex flex-col items-center justify-center px-4 py-1 transition-colors"
                >
                    <span className="material-symbols-outlined">{icon}</span>
                    <span className="text-[10px] uppercase tracking-widest font-bold">
                        {label}
                    </span>
                </button>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
    return (
        <>
            <GrainOverlay />
            <TopBar />
            <main className="pt-24 pb-24 md:pb-0">
                <HeroSection />
                <PhilosophySection />
                <FeaturesSection />
                <CtaSection />
            </main>
            <SiteFooter />
            <MobileBottomNav />
        </>
    );
}
