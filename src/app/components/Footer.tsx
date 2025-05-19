"use client";

import Image from "next/image";
import Button from "@/app/components/buttons/Button";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[var(--secondary)] border-t border-[var(--accent)] max-h-14]">
            <div className="mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div
                    className="flex items-center gap-2 text-[var(--dark)]"
                    style={{ fontFamily: "var(--font-main)" }}
                >
                    <Image
                        src="/logo.png"
                        alt="Habit Rhythm Logo"
                        width={24}
                        height={24}
                        className="object-contain"
                        priority
                    />
                    <span className="truncate text-sm">
                    © {new Date().getFullYear()} Habit Rhythm. All rights reserved.
                  </span>
                </div>
                <div className="flex gap-2 text-sm m-3">
                    <a
                        href="https://github.com/frogalo/Habit_Rythm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <Button text="GitHub" />
                    </a>
                    <Link href="/terms" className="inline-block">
                        <Button text="Terms" />
                    </Link>
                    <Link href="/privacy" className="inline-block">
                        <Button text="Privacy" />
                    </Link>
                    <a href="mailto:support@habitrhythm.com" className="inline-block">
                        <Button text="Contact" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
