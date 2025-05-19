import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/mongoose";
import { IHabit } from "@/models/User";
import { getUserFromSession } from "@/lib/getUserBySession";

// PATCH: Edit a habit (name/color) or toggle completion
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ habitId: string }> }
) {
    const { habitId } = await params;
    await dbConnect();
    const session = await getServerSession(authOptions);

    const { user, response } = await getUserFromSession(session);
    if (!user) return response!;

    const { date, name, color } = await req.json();

    const habit = user.habits.id(habitId);
    if (!habit) {
        return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Toggle completion
    if (date) {
        const idx = habit.completions.indexOf(date);
        if (idx === -1) {
            habit.completions.push(date);
        } else {
            habit.completions.splice(idx, 1);
        }
        await user.save();
        return NextResponse.json({ completions: habit.completions });
    }

    // Edit name/color
    if (name && color) {
        habit.name = name;
        habit.color = color;
        await user.save();
        return NextResponse.json({ habits: user.habits });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}

// DELETE: Remove a habit
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ habitId: string }> }
) {
    const { habitId } = await params;
    await dbConnect();
    const session = await getServerSession(authOptions);

    const { user, response } = await getUserFromSession(session);
    if (!user) return response!;

    user.habits = user.habits.filter(
        (h: IHabit) => h._id.toString() !== habitId
    );
    await user.save();

    return NextResponse.json({ habits: user.habits });
}
