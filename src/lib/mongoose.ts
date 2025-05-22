import mongoose from "mongoose";

// Ensure MONGODB_URI is always a string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/habit-rhythm";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

export async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;

    return mongoose.connect(MONGODB_URI)
}
