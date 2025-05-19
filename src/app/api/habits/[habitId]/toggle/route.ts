import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/mongoose";
import { getUserFromSession } from "@/lib/getUserBySession";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ habitId: string }> }
) {
    const { habitId } = await params;
    await dbConnect();
    const session = await getServerSession(authOptions);

    const { user, response } = await getUserFromSession(session);
    if (!user) return response!;

    const { date } = await req.json();
    if (!date) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const habit = user.habits.id(habitId);
    if (!habit) {
        return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const idx = habit.completions.indexOf(date);
    if (idx === -1) {
        habit.completions.push(date);
    } else {
        habit.completions.splice(idx, 1);
    }

    await user.save();

    return NextResponse.json({ completions: habit.completions });
}
