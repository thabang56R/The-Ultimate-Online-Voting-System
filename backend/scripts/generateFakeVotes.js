import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import User from "../models/User.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";

dotenv.config();

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8002";
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000/api/votes/cast";


const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const fakeIPs = [
  "192.168.1.1",
  "10.0.0.1",
  "172.16.0.5",
  "8.8.8.8",
  "1.1.1.1",
];

const fakeDevices = ["chrome", "firefox", "mobile", "tablet"];

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
}

async function generateVotes(count = 50) {
  const users = await User.find().limit(20);
  const elections = await Election.find();

  if (!users.length || !elections.length) {
    console.log("No users or elections found");
    return;
  }

  for (let i = 0; i < count; i++) {
    const user = randomItem(users);
    const election = randomItem(elections);

    const candidates = await Candidate.find({
      electionId: election._id,
    });

    if (!candidates.length) continue;

    const candidate = randomItem(candidates);

    
    const isSuspicious = Math.random() > 0.7;

    const payload = {
      electionId: election._id,
      candidateId: candidate._id,
      voteStartTime: new Date(
        Date.now() - rand(5, 300) * 1000
      ).toISOString(),
    };

    try {
      await axios.post(BACKEND_URL, payload, {
        headers: {
          Authorization: `Bearer ${user.token || ""}`,
          "x-device-fingerprint": isSuspicious
            ? `device-${rand(1, 10)}`
            : `device-${user._id}`,
          "x-forwarded-for": isSuspicious
            ? randomItem(fakeIPs)
            : undefined,
          "user-agent": randomItem(fakeDevices),
          "x-latitude": isSuspicious ? rand(-90, 90) : 0,
          "x-longitude": isSuspicious ? rand(-180, 180) : 0,
        },
      });

      console.log(`Vote ${i + 1}/${count} created`);
    } catch (err) {
      console.log(`Skipped vote ${i + 1}:`, err.response?.data?.message);
    }
  }

  console.log("Fake voting completed");
}

(async () => {
  try {
    await connectDB();
    await generateVotes(100);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();