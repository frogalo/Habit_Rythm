"use client";

import { useSession, signOut } from "next-auth/react";
import GoogleButton from "../components/buttons/GoogleButton";
import GithubButton from "../components/buttons/GithubButton";
import Button from "../components/buttons/Button";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/habits");
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div className="w-full max-w-md bg-[var(--accent)] rounded-lg shadow p-8">
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                        Sign in to your account
                    </h1>
                    {session ? (
                        <div className="flex flex-col items-center space-y-6 w-full">
                            <div className="mb-2 text-gray-700 dark:text-gray-200 text-center">
                                Signed in as{" "}
                                <span className="font-semibold">{session.user?.email}</span>
                            </div>
                            <Button
                                text="Sign out"
                                icon={LogOut}
                                onClick={() => signOut()}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 w-full">
                            <GoogleButton />
                            <GithubButton />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
