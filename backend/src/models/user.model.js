import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "recruiter", "developer"],
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        default: ""
    },
    // Developer-specific
    credibilityScore: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const userModel = mongoose.model("skillproof-user", userSchema);

export default userModel;