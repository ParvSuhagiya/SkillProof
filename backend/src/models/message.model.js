import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "skillproof-user",
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "skillproof-user",
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient conversation queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const messageModel = mongoose.model("skillproof-message", messageSchema);

export default messageModel;
