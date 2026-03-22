import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import User from "../models/User.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";

dotenv.config();

const BACKEND_URL = "http://localhost:5000/api/votes/cast";
const HEALTH_URL = "http://localhost:5000/api/health";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const fakeIPs = [
  "192.168.1.10",
  "10.0.0.21",
  "172.16.0.12",
  "8.8.8.8",
  "1.1.1.1",
  "105.244.10.9",
  "196.43.1.15",
  "41.74.22.9",
  "154.0.5.88",
  "197.189.2.14",
];

const fakeDevices = ["chrome", "firefox", "mobile", "tablet", "edge", "safari"];

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
}

async function generateVotes(limit = 20) {
  try {
    const test = await axios.get(HEALTH_URL, { timeout: 10000 });
    console.log("Backend reachable:", test.status);
  } catch (err) {
    console.log("Backend health test failed");
    console.log("code:", err?.code);
    console.log("message:", err?.message);
    return;
  }

  const users = await User.find({ role: "voter" });
  const elections = await Election.find({ status: "active" });

  if (!users.length || !elections.length) {
    console.log("No users or elections found");
    return;
  }

  const electionCandidatesMap = new Map();
  for (const election of elections) {
    const candidates = await Candidate.find({ electionId: election._id });
    if (candidates.length > 0) {
      electionCandidatesMap.set(String(election._id), candidates);
    }
  }

  const validElections = elections.filter((election) =>
    electionCandidatesMap.has(String(election._id))
  );

  if (!validElections.length) {
    console.log("No active elections with candidates found");
    return;
  }

  const existingVotes = await Vote.find({}, "voterId electionId");
  const usedPairs = new Set(
    existingVotes.map((vote) => `${vote.voterId.toString()}-${vote.electionId.toString()}`)
  );

  const availablePairs = [];
  for (const user of users) {
    for (const election of validElections) {
      const key = `${user._id.toString()}-${election._id.toString()}`;
      if (!usedPairs.has(key)) {
        availablePairs.push({ user, election });
      }
    }
  }

  if (!availablePairs.length) {
    console.log("No unused voter-election pairs available");
    return;
  }

  let created = 0;
  let skipped = 0;

  const shuffledPairs = availablePairs.sort(() => Math.random() - 0.5);
  const pairsToUse = shuffledPairs.slice(0, limit);

  for (let i = 0; i < pairsToUse.length; i++) {
    const { user, election } = pairsToUse[i];
    const candidates = electionCandidatesMap.get(String(election._id));
    const candidate = randomItem(candidates);

    const isSuspicious = Math.random() > 0.65;

    const payload = {
      electionId: String(election._id),
      candidateId: String(candidate._id),
      voteStartTime: new Date(Date.now() - rand(5, 300) * 1000).toISOString(),
    };

    try {
      const response = await axios.post(BACKEND_URL, payload, {
        headers: {
          "x-user-id": String(user._id),
          "x-device-fingerprint": isSuspicious
            ? `shared-device-${rand(1, 3)}`
            : `device-${user._id}`,
          "x-forwarded-for": isSuspicious ? randomItem(fakeIPs) : "",
          "user-agent": randomItem(fakeDevices),
          "x-latitude": isSuspicious ? rand(-90, 90) : -25,
          "x-longitude": isSuspicious ? rand(-180, 180) : 28,
        },
        timeout: 15000,
      });

      created++;
      console.log(
        `Vote ${i + 1}/${pairsToUse.length} created -> ${response.data?.vote?.voteStatus || "ok"}`
      );
    } catch (err) {
      skipped++;
      console.log(`Skipped vote ${i + 1}:`);
      console.log("status:", err?.response?.status);
      console.log("data:", err?.response?.data);
      console.log("message:", err?.message);
    }
  }

  console.log("\nFake voting completed");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Unused pairs left: ${Math.max(0, availablePairs.length - pairsToUse.length)}`);
}

(async () => {
  try {
    await connectDB();
    await generateVotes(20);
    process.exit();
  } catch (err) {
    console.error("Generator failed:", err);
    process.exit(1);
  }
})();