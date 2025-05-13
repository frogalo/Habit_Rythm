"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Loading...</p>;

    if (session) {
        return (
            <div>
                Signed in as {session.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </div>
        );
    }
    return (
        <div>
            Not signed in <br />
            <button onClick={() => signIn("google")}>Sign in with Google</button>
            <button onClick={() => signIn("github")}>Sign in with GitHub</button>
        </div>
    );
}