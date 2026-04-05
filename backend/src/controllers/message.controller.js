import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";

// ── POST /api/messages/send ───────────────────────────────────────────────────
// Admin sends message to recruiter (or recruiter replies to admin)
export async function sendMessage(req, res) {
    const { receiverId, content } = req.body;

    if (!receiverId || !content?.trim()) {
        return res.status(400).json({ message: "receiverId and content are required" });
    }

    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
    }

    // Only allow Admin↔Recruiter messaging
    const senderRole = req.user.role;
    const receiverRole = receiver.role;

    const validCombo =
        (senderRole === "admin" && receiverRole === "recruiter") ||
        (senderRole === "recruiter" && receiverRole === "admin");

    if (!validCombo) {
        return res.status(403).json({
            message: "Messaging is only allowed between admins and recruiters"
        });
    }

    const message = await messageModel.create({
        sender: req.user._id,
        receiver: receiverId,
        content: content.trim()
    });

    res.status(201).json({ message: "Message sent", data: message });
}

// ── GET /api/messages/conversation/:userId ────────────────────────────────────
// Get full conversation between current user and specified user
export async function getConversation(req, res) {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel
        .find({
            $or: [
                { sender: myId, receiver: userId },
                { sender: userId, receiver: myId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "username role")
        .populate("receiver", "username role");

    // Mark messages from the other person as read
    await messageModel.updateMany(
        { sender: userId, receiver: myId, read: false },
        { read: true }
    );

    res.status(200).json({ messages });
}

// ── GET /api/messages/inbox ───────────────────────────────────────────────────
// Get all conversations for the current user (unique contact list with last message)
export async function getInbox(req, res) {
    const myId = req.user._id;

    // Get all messages involving this user
    const allMessages = await messageModel
        .find({
            $or: [{ sender: myId }, { receiver: myId }]
        })
        .sort({ createdAt: -1 })
        .populate("sender", "username role")
        .populate("receiver", "username role");

    // Build unique conversation list (latest message per contact)
    const conversationsMap = new Map();

    for (const msg of allMessages) {
        const contact = msg.sender._id.toString() === myId.toString()
            ? msg.receiver
            : msg.sender;

        const contactId = contact._id.toString();
        if (!conversationsMap.has(contactId)) {
            const unreadCount = await messageModel.countDocuments({
                sender: contactId,
                receiver: myId,
                read: false
            });
            conversationsMap.set(contactId, {
                contact: { _id: contact._id, username: contact.username, role: contact.role },
                lastMessage: { content: msg.content, createdAt: msg.createdAt },
                unreadCount
            });
        }
    }

    res.status(200).json({ conversations: Array.from(conversationsMap.values()) });
}
