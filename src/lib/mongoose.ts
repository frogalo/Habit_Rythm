import mongoose from "mongoose";

// Ensure MONGODB_URI is always a string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/habit-rhythm";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

export async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB is already connected.");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB connection established successfully.");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
