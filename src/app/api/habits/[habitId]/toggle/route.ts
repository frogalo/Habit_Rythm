import {NextRequest, NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {dbConnect} from "@/lib/mongoose";
import User from "@/models/User";

export async function PATCH(
    req: NextRequest,
    {params}: { params: { habitId: string } }
) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const {date} = await req.json();
    if (!date) {
        return NextResponse.json({error: "Date is required"}, {status: 400});
    }

    const user = await User.findOne({email: session.user.email});
    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    const habit = user.habits.id(params.habitId);
    if (!habit) {
        return NextResponse.json({error: "Habit not found"}, {status: 404});
    }

    const idx = habit.completions.indexOf(date);
    if (idx === -1) {
        habit.completions.push(date);
    } else {
        habit.completions.splice(idx, 1);
    }

    await user.save();

    return NextResponse.json({completions: habit.completions});
}
