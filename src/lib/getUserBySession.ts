import { NextResponse } from "next/server";
import User from "@/models/User";
import type { Session } from "next-auth";

export async function getUserFromSession(session: Session | null) {
    if (!session?.user?.email) {
        return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return { user: null, response: NextResponse.json({ error: "User not found" }, { status: 404 }) };
    }

    return { user, response: null };
}
