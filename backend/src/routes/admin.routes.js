import { Router } from "express";
import { authenticate, allowRoles } from "../middleware/auth.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const adminRouter = Router();

const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// All admin routes require authentication + admin role
adminRouter.use(authenticate, allowRoles("admin"));

adminRouter.get("/recruiters",                       ah(adminController.listRecruiters));
adminRouter.get("/my-recruiters",                    ah(adminController.myRecruiters));
adminRouter.post("/hire-recruiter/:recruiterId",     ah(adminController.hireRecruiter));
adminRouter.delete("/fire-recruiter/:recruiterId",   ah(adminController.fireRecruiter));
adminRouter.post("/rate-recruiter/:recruiterId",     ah(adminController.rateRecruiter));
adminRouter.get("/developers",                       ah(adminController.listDevelopers));

export default adminRouter;
