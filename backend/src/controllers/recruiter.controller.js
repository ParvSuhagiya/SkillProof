import recruiterAdminRelationModel from "../models/recruiterAdminRelation.model.js";
import ratingModel from "../models/rating.model.js";
import userModel from "../models/user.model.js";

// ── GET /api/recruiter/my-admins ──────────────────────────────────────────────
// Recruiter sees all admins they are associated with
export async function myAdmins(req, res) {
    const relations = await recruiterAdminRelationModel.find({
        recruiter: req.user._id,
        status: "active"
    }).populate("admin", "username email bio createdAt");

    const admins = relations.map((r) => ({
        ...r.admin.toObject(),
        hiredAt: r.createdAt
    }));

    res.status(200).json({ admins, count: admins.length, maxAllowed: 5 });
}

// ── GET /api/recruiter/my-rating ─────────────────────────────────────────────
// Recruiter sees their average rating + individual reviews
export async function myRating(req, res) {
    const ratings = await ratingModel
        .find({ recruiter: req.user._id })
        .populate("admin", "username")
        .sort({ createdAt: -1 });

    const avgRating =
        ratings.length > 0
            ? (ratings.reduce((s, r) => s + r.value, 0) / ratings.length).toFixed(1)
            : null;

    res.status(200).json({
        avgRating: avgRating ? parseFloat(avgRating) : null,
        totalRatings: ratings.length,
        ratings: ratings.map((r) => ({
            _id: r._id,
            value: r.value,
            feedback: r.feedback,
            adminUsername: r.admin?.username || "Unknown",
            createdAt: r.createdAt
        }))
    });
}
