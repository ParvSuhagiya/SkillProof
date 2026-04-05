import mongoose, { Schema } from "mongoose";

const testCaseSchema = new Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
}, { _id: false });

const challengeSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    timeLimitSeconds: {
        type: Number,
        default: 3600 // 1 hour
    },
    testCases: {
        type: [testCaseSchema],
        default: []
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "skillproof-user",
        required: true
    },
    creatorRole: {
        type: String,
        enum: ["admin", "recruiter"],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const challengeModel = mongoose.model("skillproof-challenge", challengeSchema);

export default challengeModel;
