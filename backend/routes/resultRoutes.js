
import express from "express";
import { getElectionResults } from "../controllers/resultController.js";

const router = express.Router();

router.get("/:electionId", getElectionResults);

export default router;