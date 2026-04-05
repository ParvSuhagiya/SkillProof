import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
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
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        default: "",
        maxlength: 500
    }
}, { timestamps: true });

// One rating per admin per recruiter — prevents duplicates
ratingSchema.index({ recruiter: 1, admin: 1 }, { unique: true });

const ratingModel = mongoose.model("skillproof-rating", ratingSchema);

export default ratingModel;
