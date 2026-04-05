import mongoose, { Schema } from "mongoose";

const recruiterAdminRelationSchema = new Schema({
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: "skillproof-user",
        required: true
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "skillproof-user",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "active", "rejected"],
        default: "active"
    }
}, { timestamps: true });

// Prevent duplicate admin-recruiter pairs
recruiterAdminRelationSchema.index({ recruiter: 1, admin: 1 }, { unique: true });

const recruiterAdminRelationModel = mongoose.model(
    "skillproof-recruiter-admin-relation",
    recruiterAdminRelationSchema
);

export default recruiterAdminRelationModel;
