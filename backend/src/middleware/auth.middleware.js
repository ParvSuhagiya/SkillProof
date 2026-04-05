import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../models/user.model.js";

/**
 * authenticate — verifies Bearer JWT, attaches req.user = { id, role }
 */
export async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    if (!user.verified) {
        return res.status(403).json({ message: "Email not verified" });
    }

    req.user = user;
    next();
}

/**
 * allowRoles(...roles) — role-guard factory
 * Usage: router.get("/admin-only", authenticate, allowRoles("admin"), handler)
 */
export function allowRoles(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(" or ")}`
            });
        }
        next();
    };
}
