import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { getSerializedHabitsForUser, serializeHabits } from "@/lib/habitData";
import { getUserFromSession } from "@/lib/getUserBySession";

export async function GET() {
    const session = await getServerSession(authOptions);
    const { user, response } = await getUserFromSession(session);

    if (!user) {
        return response!;
    }

    return NextResponse.json({ habits: serializeHabits(user.habits) });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const { user, response } = await getUserFromSession(session);

    if (!user) {
        return response!;
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const color = typeof body.color === "string" ? body.color : "";

    if (!name || !color) {
        return NextResponse.json({ error: "Name and color are required" }, { status: 400 });
    }

    await prisma.habit.create({
        data: {
            userId: user.id,
            name,
            color,
        },
    });

    const habits = await getSerializedHabitsForUser(user.id);

    return NextResponse.json({ habits });
}
