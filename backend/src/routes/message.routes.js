import { Router } from "express";
import { authenticate, allowRoles } from "../middleware/auth.middleware.js";
import * as messageController from "../controllers/message.controller.js";

const messageRouter = Router();

const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// All message routes require authentication
// Admin and recruiter can message each other
messageRouter.use(authenticate);

messageRouter.post("/send",                        ah(messageController.sendMessage));
messageRouter.get("/inbox",                        ah(messageController.getInbox));
messageRouter.get("/conversation/:userId",         ah(messageController.getConversation));

export default messageRouter;
