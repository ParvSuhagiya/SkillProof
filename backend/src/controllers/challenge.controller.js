import challengeModel from "../models/challenge.model.js";

// ── POST /api/challenges ──────────────────────────────────────────────────────
// Admin OR Recruiter can create challenges
export async function createChallenge(req, res) {
    const { title, description, difficulty, tags = [], timeLimitSeconds = 3600, testCases = [] } = req.body;

    if (!title || !description || !difficulty) {
        return res.status(400).json({ message: "title, description, and difficulty are required" });
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
        return res.status(400).json({ message: "difficulty must be easy, medium, or hard" });
    }

    const challenge = await challengeModel.create({
        title,
        description,
        difficulty,
        tags,
        timeLimitSeconds,
        testCases,
        createdBy: req.user._id,
        creatorRole: req.user.role
    });

    res.status(201).json({ message: "Challenge created successfully", challenge });
}

// ── GET /api/challenges ───────────────────────────────────────────────────────
// All authenticated users can list challenges
export async function listChallenges(req, res) {
    const { difficulty, tag, search } = req.query;
    const filter = { isActive: true };

    if (difficulty) filter.difficulty = difficulty;
    if (tag) filter.tags = tag;
    if (search) filter.title = { $regex: search, $options: "i" };

    const challenges = await challengeModel
        .find(filter)
        .populate("createdBy", "username role")
        .sort({ createdAt: -1 });

    res.status(200).json({ challenges });
}

// ── GET /api/challenges/:id ───────────────────────────────────────────────────
export async function getChallenge(req, res) {
    const challenge = await challengeModel
        .findById(req.params.id)
        .populate("createdBy", "username role");

    if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
    }

    res.status(200).json({ challenge });
}

// ── PUT /api/challenges/:id ───────────────────────────────────────────────────
// ⚠️ Admin CANNOT edit — only recruiter who created it OR same-role creator
export async function updateChallenge(req, res) {
    // Business Rule: Admins cannot edit challenges
    if (req.user.role === "admin") {
        return res.status(403).json({ message: "Admins cannot edit challenges" });
    }

    const challenge = await challengeModel.findById(req.params.id);
    if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
    }

    // Only the creator can edit
    if (challenge.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only edit challenges you created" });
    }

    const { title, description, difficulty, tags, timeLimitSeconds, testCases, isActive } = req.body;

    if (title) challenge.title = title;
    if (description) challenge.description = description;
    if (difficulty) challenge.difficulty = difficulty;
    if (tags) challenge.tags = tags;
    if (timeLimitSeconds) challenge.timeLimitSeconds = timeLimitSeconds;
    if (testCases) challenge.testCases = testCases;
    if (typeof isActive === "boolean") challenge.isActive = isActive;

    await challenge.save();

    res.status(200).json({ message: "Challenge updated", challenge });
}

// ── DELETE /api/challenges/:id ───────────────────────────────────────────────
// ⚠️ Admin CANNOT delete — only recruiter who created it
export async function deleteChallenge(req, res) {
    // Business Rule: Admins cannot delete challenges
    if (req.user.role === "admin") {
        return res.status(403).json({ message: "Admins cannot delete challenges" });
    }

    const challenge = await challengeModel.findById(req.params.id);
    if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
    }

    if (challenge.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You can only delete challenges you created" });
    }

    await challenge.deleteOne();

    res.status(200).json({ message: "Challenge deleted" });
}
