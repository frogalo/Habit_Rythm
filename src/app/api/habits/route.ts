import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/mongoose";
import User, { IUser } from "@/models/User";

// GET: Return all habits for the logged-in user
export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).lean() as IUser | null;
    if (!user) {
        return NextResponse.json({ habits: [] });
    }

    return NextResponse.json({ habits: user.habits || [] });
}

// POST: Add a new habit for the logged-in user
export async function POST(req: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions); // <-- CORRECT

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, color } = body;

    if (!name || !color) {
        return NextResponse.json({ error: "Name and color are required" }, { status: 400 });
    }

    // Add the new habit
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.habits.push({
        name,
        color,
        completions: [],
    });

    await user.save();

    return NextResponse.json({ habits: user.habits });
}
