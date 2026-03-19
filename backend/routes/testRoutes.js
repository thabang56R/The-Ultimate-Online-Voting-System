// backend/routes/testRoutes.js
import express from "express";
import { testMl } from "../controllers/testMlController.js";

const router = express.Router();

router.get("/ml", testMl);

export default router;