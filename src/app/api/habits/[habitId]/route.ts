import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {dbConnect} from "@/lib/mongoose";
import User, {IHabit} from "@/models/User";

// PATCH: Edit a habit (name/color)
export async function PATCH(req: NextRequest, {params}: { params: { habitId: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {name, color} = await req.json();
    if (!name || !color) {
        return NextResponse.json({error: "Name and color are required"}, {status: 400});
    }

    const user = await User.findOne({email: session.user.email});
    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    const habit = user.habits.id(params.habitId);
    if (!habit) {
        return NextResponse.json({error: "Habit not found"}, {status: 404});
    }

    habit.name = name;
    habit.color = color;
    await user.save();

    return NextResponse.json({habits: user.habits});
}

// DELETE: Remove a habit
export async function DELETE(_req: NextRequest, {params}: { params: { habitId: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const user = await User.findOne({email: session.user.email});
    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    user.habits = user.habits.filter(
        (h: IHabit) => h._id.toString() !== params.habitId
    );
    await user.save();

    return NextResponse.json({habits: user.habits});
}
