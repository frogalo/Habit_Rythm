"use client";

import Image from "next/image";
import Button from "@/app/components/buttons/Button";

export default function Footer() {
    return (
        <footer className="w-full bg-[var(--background)] border-t border-[var(--accent)] max-h-14">
            <div className="mx-auto px-6 h-14 flex flex-col md:flex-row items-center justify-between gap-4">
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
                <div className="flex gap-2 text-sm">
                    <a
                        href="https://github.com/frogalo/Habit_Rythm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <Button
                            text="GitHub"
                            className="bg-[var(--secondary)] hover:bg-[var(--purple)] text-[var(--foreground)] px-3 py-1 text-sm"
                        />
                    </a>
                    <a href="mailto:support@habitrhythm.com" className="inline-block">
                        <Button
                            text="Contact"
                            className="bg-[var(--secondary)] hover:bg-[var(--purple)] text-[var(--foreground)] px-3 py-1 text-sm"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
