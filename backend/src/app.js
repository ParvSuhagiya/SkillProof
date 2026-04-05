import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import recruiterRouter from "./routes/recruiter.routes.js";
import messageRouter from "./routes/message.routes.js";
import challengeRouter from "./routes/challenge.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/auth",       authRouter);
app.use("/api/admin",      adminRouter);
app.use("/api/recruiter",  recruiterRouter);
app.use("/api/messages",   messageRouter);
app.use("/api/challenges", challengeRouter);

// Error handling middleware - MUST be last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;