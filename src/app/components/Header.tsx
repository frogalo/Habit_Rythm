"use client";

import Link from "next/link";
import Image from "next/image";
import {useSession, signOut} from "next-auth/react";
import {LogOut, LogIn} from "lucide-react";
import Button from "@/app/components/buttons/Button";

export default function Header() {
    const {data: session, status} = useSession();

    return (
        <header
            className="w-full bg-[var(--background)]/80 backdrop-blur sticky top-0 z-30 border-b border-[var(--accent)]">
            <nav className="mx-auto flex items-center justify-between px-6 h-16">
                <Link
                    href="/"
                    className="flex items-center gap-3 text-2xl font-bold text-[var(--purple)]"
                    style={{fontFamily: "var(--font-main)"}}
                >
          <span>
            <Image
                src="/logo.png"
                alt="Habit Rhythm Logo"
                width={58}
                height={58}
                className="object-contain"
                priority
            />
          </span>
                    Habit Rhythm
                </Link>
                <div className="flex items-center gap-4">
                    {status === "loading" ? null : session ? (
                        <>
              <span
                  className="text-[var(--dark)] font-medium"
                  style={{fontFamily: "var(--font-main)"}}
              >
                {session.user?.email}
              </span>
                            <Link href="/habits" className="inline-block">
                                <Button
                                    text="Tracker"
                                />
                            </Link>
                            <Button
                                text="Sign out"
                                icon={LogOut}
                                onClick={() => signOut()}
                            />

                        </>
                    ) : (
                        <>
                            <Link href="/login" className="inline-block">
                                <Button
                                    text="Login"
                                    icon={LogIn}
                                />
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
