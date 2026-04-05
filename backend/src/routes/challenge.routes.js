import { Router } from "express";
import { authenticate, allowRoles } from "../middleware/auth.middleware.js";
import * as challengeController from "../controllers/challenge.controller.js";

const challengeRouter = Router();

const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET all challenges — any authenticated user
challengeRouter.get("/",    authenticate, ah(challengeController.listChallenges));
challengeRouter.get("/:id", authenticate, ah(challengeController.getChallenge));

// CREATE — admin or recruiter only
challengeRouter.post(
    "/",
    authenticate,
    allowRoles("admin", "recruiter"),
    ah(challengeController.createChallenge)
);

// EDIT — recruiter only (admin blocked inside controller too for defense-in-depth)
challengeRouter.put(
    "/:id",
    authenticate,
    allowRoles("recruiter"),
    ah(challengeController.updateChallenge)
);

// DELETE — recruiter only
challengeRouter.delete(
    "/:id",
    authenticate,
    allowRoles("recruiter"),
    ah(challengeController.deleteChallenge)
);

export default challengeRouter;
