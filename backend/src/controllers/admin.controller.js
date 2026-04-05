import userModel from "../models/user.model.js";
import recruiterAdminRelationModel from "../models/recruiterAdminRelation.model.js";
import ratingModel from "../models/rating.model.js";

// ── GET /api/admin/recruiters ─────────────────────────────────────────────────
// List all recruiters on the platform, with their average rating
export async function listRecruiters(req, res) {
    const recruiters = await userModel
        .find({ role: "recruiter", verified: true })
        .select("username email bio credibilityScore createdAt");

    // Attach average rating and admin count to each recruiter
    const enriched = await Promise.all(
        recruiters.map(async (r) => {
            const ratings = await ratingModel.find({ recruiter: r._id });
            const avgRating =
                ratings.length > 0
                    ? (ratings.reduce((s, x) => s + x.value, 0) / ratings.length).toFixed(1)
                    : null;

            const adminCount = await recruiterAdminRelationModel.countDocuments({
                recruiter: r._id,
                status: "active"
            });

            // Check if THIS admin already hired this recruiter
            const alreadyHired = await recruiterAdminRelationModel.exists({
                recruiter: r._id,
                admin: req.user._id,
                status: "active"
            });

            return {
                _id: r._id,
                username: r.username,
                email: r.email,
                bio: r.bio,
                createdAt: r.createdAt,
                avgRating,
                totalRatings: ratings.length,
                adminCount,
                alreadyHired: !!alreadyHired
            };
        })
    );

    res.status(200).json({ recruiters: enriched });
}

// ── POST /api/admin/hire-recruiter/:recruiterId ───────────────────────────────
// Admin hires a recruiter (enforces max 5 admins per recruiter)
export async function hireRecruiter(req, res) {
    const { recruiterId } = req.params;
    const adminId = req.user._id;

    const recruiter = await userModel.findOne({ _id: recruiterId, role: "recruiter" });
    if (!recruiter) {
        return res.status(404).json({ message: "Recruiter not found" });
    }

    // Check if already hired
    const existingRelation = await recruiterAdminRelationModel.findOne({
        recruiter: recruiterId,
        admin: adminId
    });
    if (existingRelation) {
        return res.status(400).json({ message: "You have already hired this recruiter" });
    }

    // ⚠️ Business Rule: max 5 admins per recruiter
    const adminCount = await recruiterAdminRelationModel.countDocuments({
        recruiter: recruiterId,
        status: "active"
    });

    if (adminCount >= 5) {
        return res.status(400).json({
            message: "This recruiter has reached the maximum of 5 admin associations"
        });
    }

    await recruiterAdminRelationModel.create({
        recruiter: recruiterId,
        admin: adminId,
        status: "active"
    });

    res.status(201).json({ message: "Recruiter hired successfully" });
}

// ── DELETE /api/admin/fire-recruiter/:recruiterId ─────────────────────────────
// Admin removes relation with a recruiter
export async function fireRecruiter(req, res) {
    const { recruiterId } = req.params;
    const adminId = req.user._id;

    const relation = await recruiterAdminRelationModel.findOneAndDelete({
        recruiter: recruiterId,
        admin: adminId
    });

    if (!relation) {
        return res.status(404).json({ message: "Relation not found" });
    }

    res.status(200).json({ message: "Recruiter removed from your team" });
}

// ── POST /api/admin/rate-recruiter/:recruiterId ───────────────────────────────
// Admin rates a recruiter 1–5, once per admin (upsert so admin can update)
export async function rateRecruiter(req, res) {
    const { recruiterId } = req.params;
    const adminId = req.user._id;
    const { value, feedback = "" } = req.body;

    if (!value || value < 1 || value > 5) {
        return res.status(400).json({ message: "Rating value must be between 1 and 5" });
    }

    const recruiter = await userModel.findOne({ _id: recruiterId, role: "recruiter" });
    if (!recruiter) {
        return res.status(404).json({ message: "Recruiter not found" });
    }

    // Check that admin has a relationship with this recruiter
    const relation = await recruiterAdminRelationModel.findOne({
        recruiter: recruiterId,
        admin: adminId,
        status: "active"
    });
    if (!relation) {
        return res.status(403).json({
            message: "You can only rate recruiters you have hired"
        });
    }

    // Upsert — admin can update their rating but can't add a second one
    const rating = await ratingModel.findOneAndUpdate(
        { recruiter: recruiterId, admin: adminId },
        { value, feedback },
        { upsert: true, new: true }
    );

    res.status(200).json({ message: "Rating saved", rating });
}

// ── GET /api/admin/developers ─────────────────────────────────────────────────
// Admin can view developers (read-only, cannot delete or modify)
export async function listDevelopers(req, res) {
    const developers = await userModel
        .find({ role: "developer", verified: true })
        .select("username email bio credibilityScore createdAt")
        .sort({ credibilityScore: -1 });

    res.status(200).json({ developers });
}

// ── GET /api/admin/my-recruiters ─────────────────────────────────────────────
// Recruiters this admin has hired
export async function myRecruiters(req, res) {
    const relations = await recruiterAdminRelationModel.find({
        admin: req.user._id,
        status: "active"
    }).populate("recruiter", "username email bio createdAt");

    const recruiters = relations.map((r) => r.recruiter);
    res.status(200).json({ recruiters });
}
