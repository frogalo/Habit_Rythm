import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { getSerializedHabitsForUser } from "@/lib/habitData";
import { getUserFromSession } from "@/lib/getUserBySession";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ habitId: string }> }
) {
    const { habitId } = await params;
    const session = await getServerSession(authOptions);

    const { user, response } = await getUserFromSession(session);
    if (!user) {
        return response!;
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const color = typeof body.color === "string" ? body.color : "";
    const habit = await prisma.habit.findFirst({
        where: {
            id: habitId,
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    if (!habit) {
        return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    if (name && color) {
        await prisma.habit.update({
            where: { id: habitId },
            data: {
                name,
                color,
            },
        });

        const habits = await getSerializedHabitsForUser(user.id);

        return NextResponse.json({ habits });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ habitId: string }> }
) {
    const { habitId } = await params;
    const session = await getServerSession(authOptions);

    const { user, response } = await getUserFromSession(session);
    if (!user) {
        return response!;
    }

    const habit = await prisma.habit.findFirst({
        where: {
            id: habitId,
            userId: user.id,
        },
        select: {
            id: true,
        },
    });

    if (!habit) {
        return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({
        where: { id: habitId },
    });

    const habits = await getSerializedHabitsForUser(user.id);

    return NextResponse.json({ habits });
}
