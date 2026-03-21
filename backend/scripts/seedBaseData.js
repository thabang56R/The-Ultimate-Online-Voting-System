import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";

dotenv.config();

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
}

async function seedBaseData() {
  await Candidate.deleteMany({});
  await Election.deleteMany({});
  await User.deleteMany({ email: /@securevote\.demo$/ });

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  const users = await User.insertMany([
    {
      fullName: "Admin User",
      email: "admin@securevote.demo",
      password: hashedPassword,
      role: "admin",
      failedLoginAttempts: 0,
    },
    {
      fullName: "Election Officer",
      email: "officer@securevote.demo",
      password: hashedPassword,
      role: "election_officer",
      failedLoginAttempts: 0,
    },
    {
      fullName: "Thabo Mokoena",
      email: "thabo@securevote.demo",
      password: hashedPassword,
      role: "voter",
      failedLoginAttempts: 0,
    },
    {
      fullName: "Lerato Nkosi",
      email: "lerato@securevote.demo",
      password: hashedPassword,
      role: "voter",
      failedLoginAttempts: 1,
    },
    {
      fullName: "Kagiso Mbele",
      email: "kagiso@securevote.demo",
      password: hashedPassword,
      role: "voter",
      failedLoginAttempts: 0,
    },
    {
      fullName: "Ayanda Dlamini",
      email: "ayanda@securevote.demo",
      password: hashedPassword,
      role: "voter",
      failedLoginAttempts: 2,
    },
    {
      fullName: "Neo Masango",
      email: "neo@securevote.demo",
      password: hashedPassword,
      role: "voter",
      failedLoginAttempts: 0,
    },
  ]);

  const adminUser = users.find((user) => user.role === "admin");

  const elections = await Election.insertMany([
    {
      title: "SRC General Election 2026",
      description: "Student representative council general election.",
      startDate: new Date("2026-03-20T08:00:00Z"),
      endDate: new Date("2026-03-30T18:00:00Z"),
      status: "active",
      createdBy: adminUser._id,
    },
    {
      title: "Faculty Board Election 2026",
      description: "Faculty board representatives election.",
      startDate: new Date("2026-03-18T08:00:00Z"),
      endDate: new Date("2026-03-28T18:00:00Z"),
      status: "active",
      createdBy: adminUser._id,
    },
  ]);

  const [srcElection, facultyElection] = elections;

  await Candidate.insertMany([
    {
      fullName: "Sipho Khumalo",
      manifesto: "Transparency, student service, and innovation.",
      imageUrl: "",
      electionId: srcElection._id,
    },
    {
      fullName: "Naledi Maseko",
      manifesto: "Academic support, inclusion, and accountability.",
      imageUrl: "",
      electionId: srcElection._id,
    },
    {
      fullName: "Karabo Ndlovu",
      manifesto: "Leadership that prioritizes student wellbeing.",
      imageUrl: "",
      electionId: srcElection._id,
    },
    {
      fullName: "Zanele Mokoena",
      manifesto: "Faculty growth and student representation.",
      imageUrl: "",
      electionId: facultyElection._id,
    },
    {
      fullName: "Tumelo Phiri",
      manifesto: "Better communication and stronger governance.",
      imageUrl: "",
      electionId: facultyElection._id,
    },
  ]);

  console.log("Base data seeded successfully");
  console.log("\nDemo logins:");
  console.log("Admin: admin@securevote.demo / Password@123");
  console.log("Officer: officer@securevote.demo / Password@123");
  console.log("Voter: thabo@securevote.demo / Password@123");
}

(async () => {
  try {
    await connectDB();
    await seedBaseData();
    process.exit();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
})();