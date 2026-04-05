import { Router } from "express";
import { authenticate, allowRoles } from "../middleware/auth.middleware.js";
import * as recruiterController from "../controllers/recruiter.controller.js";

const recruiterRouter = Router();

const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// All recruiter routes require authentication + recruiter role
recruiterRouter.use(authenticate, allowRoles("recruiter"));

recruiterRouter.get("/my-admins",  ah(recruiterController.myAdmins));
recruiterRouter.get("/my-rating",  ah(recruiterController.myRating));

export default recruiterRouter;
