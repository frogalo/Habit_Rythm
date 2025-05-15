import { Schema, Document, models, model } from "mongoose";

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
    // General
    createdAt: Date;
    updatedAt: Date;
}

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
    // General
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Prevent model overwrite upon hot-reload
export default models.User || model<IUser>("User", UserSchema);
