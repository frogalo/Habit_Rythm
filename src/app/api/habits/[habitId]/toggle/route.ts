import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { getUserFromSession } from "@/lib/getUserBySession";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ habitId: string }> }
) {
    const { habitId } = await params;
    const session = await getServerSession(authOptions);

    const { user, response } = await getUserFromSession(session);
    if (!user) return response!;

    const { date } = await req.json();
    if (typeof date !== "string" || !date) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
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

    const existingCompletion = await prisma.habitCompletion.findUnique({
        where: {
            habitId_date: {
                habitId,
                date,
            },
        },
        select: {
            id: true,
        },
    });

    if (existingCompletion) {
        await prisma.habitCompletion.delete({
            where: {
                habitId_date: {
                    habitId,
                    date,
                },
            },
        });
    } else {
        await prisma.habitCompletion.create({
            data: {
                habitId,
                date,
            },
        });
    }

    const completions = await prisma.habitCompletion.findMany({
        where: {
            habitId,
        },
        orderBy: {
            date: "asc",
        },
        select: {
            date: true,
        },
    });

    return NextResponse.json({
        completions: completions.map((completion) => completion.date),
    });
}
