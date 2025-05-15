import { Schema, Document, models, model, Types } from "mongoose";

export interface IHabit {
    _id: Types.ObjectId;
    name: string;
    color: string;
    completions: string[]; // ["2025-05-15", ...]
}

export interface IUser extends Document {
    name?: string;
    email: string;
    provider: string[];
    githubImage?: string;
    googleImage?: string;
    // Google-specific
    given_name?: string;
    family_name?: string;
    locale?: string;
    googleProfile?: unknown;
    // GitHub-specific
    login?: string;
    githubId?: string;
    githubProfile?: unknown;
    // Habits
    habits: IHabit[];
    // General
    createdAt: Date;
    updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>({
    name: { type: String, required: true },
    color: { type: String, required: true },
    completions: [{ type: String, match: /^\d{4}-\d{2}-\d{2}$/ }], // YYYY-MM-DD
}, { _id: true }); // auto _id for each habit

const UserSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    provider: { type: [String], default: [] },
    githubImage: { type: String },
    googleImage: { type: String },
    // Google
    given_name: { type: String },
    family_name: { type: String },
    locale: { type: String },
    googleProfile: { type: Schema.Types.Mixed },
    // GitHub
    login: { type: String },
    githubId: { type: String },
    githubProfile: { type: Schema.Types.Mixed },
    // Habits
    habits: { type: [HabitSchema], default: [] },
    // General
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Prevent model overwrite upon hot-reload
export default models.User || model<IUser>("User", UserSchema);
