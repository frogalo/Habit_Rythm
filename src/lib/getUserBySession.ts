import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userHabitInclude } from "@/lib/habitData";
import type { Session } from "next-auth";

export async function getUserFromSession(session: Session | null) {
    if (!session?.user?.email) {
        return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: userHabitInclude,
    });

    if (!user) {
        return { user: null, response: NextResponse.json({ error: "User not found" }, { status: 404 }) };
    }

    return { user, response: null };
}
