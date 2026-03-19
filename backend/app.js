import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { notFound } from "./middlewares/notFoundMiddleware.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

import testRoutes from "./routes/testRoutes.js";
import resultRoutes from "./routes/resultRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";



const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests, please try again later.",
  })
);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SecureVote AI backend is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/admin/audit-logs", auditLogRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;