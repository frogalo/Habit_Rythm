"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const PUBLIC_PATHS = ["/", "/login"];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname() || "";

    useEffect(() => {
        if (
            status === "unauthenticated" &&
            !PUBLIC_PATHS.includes(pathname) &&
            !pathname.startsWith("/api")
        ) {
            router.replace("/login");
        }
    }, [status, pathname, router]);

    if (
        status === "loading" ||
        (status === "unauthenticated" &&
            !PUBLIC_PATHS.includes(pathname) &&
            !pathname.startsWith("/api"))
    ) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
