// =============================================================================
// EcoByte - Database Seeding Script
// Populates MongoDB collections with mock users, habits, reports, and rewards
// =============================================================================

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import User from "../models/User";
import HabitEntry from "../models/HabitEntry";
import CarbonReport from "../models/CarbonReport";
import Challenge from "../models/Challenge";
import Achievement from "../models/Achievement";
import { connectDB } from "./mongodb";
import { calculateCarbonFootprint } from "./carbon-calculator";
import { CHALLENGE_TEMPLATES } from "./challenges-data";
import { ACHIEVEMENT_DEFINITIONS } from "./achievements-data";
import { HabitEntryData } from "../types";

async function seed() {
  console.log("🌱 Starting EcoByte database seed...");

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined in the environment. Please check your .env file.");
    process.exit(1);
  }

  // 1. Connect to Database
  await connectDB();
  console.log("Connected to MongoDB.");

  // 2. Clear Existing Data
  console.log("Clearing existing collections...");
  await User.deleteMany({});
  await HabitEntry.deleteMany({});
  await CarbonReport.deleteMany({});
  await Challenge.deleteMany({});
  await Achievement.deleteMany({});
  console.log("Collections cleared.");

  // 3. Create Users
  console.log("Creating mock users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Admin User
  const adminUser = await User.create({
    name: "Eco Admin",
    email: "admin@ecobyte.com",
    password: hashedPassword,
    role: "admin",
    xp: 2500,
    streak: 15,
    lastActiveDate: new Date(),
  });

  // Regular Active User
  const normalUser = await User.create({
    name: "Jane Eco",
    email: "user@ecobyte.com",
    password: hashedPassword,
    role: "user",
    xp: 680,
    streak: 5,
    lastActiveDate: new Date(),
  });

  // New Empty User (for testing empty states)
  const emptyUser = await User.create({
    name: "John Newbie",
    email: "empty@ecobyte.com",
    password: hashedPassword,
    role: "user",
    xp: 0,
    streak: 0,
  });

  console.log(`Users created:
  - Admin: ${adminUser.email} (password: password123)
  - Active: ${normalUser.email} (password: password123)
  - Empty: ${emptyUser.email} (password: password123)`);

  // 4. Generate Habit Entries & Carbon Reports for Jane Eco (Active User)
  console.log("Generating historical carbon footprint reports for Active User...");

  const now = new Date();

  // A. Generate Historical Monthly Reports (Last 3 Months)
  // March (High emissions)
  const marchHabits: HabitEntryData = {
    streaming: { hoursPerDay: 5, quality: "4K" },
    gaming: { hoursPerDay: 4, platform: "pc" },
    aiUsage: { promptsPerDay: 50, imageGensPerDay: 10, codingHours: 4 },
    cloudStorage: { storageGB: 850 },
    videoMeetings: { hoursPerWeek: 25 },
    emails: { sentPerDay: 80 },
    devices: { laptopHours: 8, desktopHours: 6, smartphoneHours: 5 },
  };
  const marchReport = calculateCarbonFootprint(marchHabits);
  const marchDate = new Date(now.getFullYear(), now.getMonth() - 3, 28);
  const marchHabitDoc = await HabitEntry.create({
    userId: normalUser._id,
    date: marchDate,
    ...marchHabits,
  });
  await CarbonReport.create({
    userId: normalUser._id,
    habitEntryId: marchHabitDoc._id,
    date: marchDate,
    emissions: marchReport.emissions,
    carbonScore: marchReport.carbonScore,
    scoreCategory: marchReport.scoreCategory,
    period: "monthly",
  });

  // April (Medium emissions - starting to improve)
  const aprilHabits: HabitEntryData = {
    streaming: { hoursPerDay: 3, quality: "1080p" },
    gaming: { hoursPerDay: 2, platform: "console" },
    aiUsage: { promptsPerDay: 30, imageGensPerDay: 4, codingHours: 2 },
    cloudStorage: { storageGB: 500 },
    videoMeetings: { hoursPerWeek: 15 },
    emails: { sentPerDay: 40 },
    devices: { laptopHours: 6, desktopHours: 2, smartphoneHours: 4 },
  };
  const aprilReport = calculateCarbonFootprint(aprilHabits);
  const aprilDate = new Date(now.getFullYear(), now.getMonth() - 2, 28);
  const aprilHabitDoc = await HabitEntry.create({
    userId: normalUser._id,
    date: aprilDate,
    ...aprilHabits,
  });
  await CarbonReport.create({
    userId: normalUser._id,
    habitEntryId: aprilHabitDoc._id,
    date: aprilDate,
    emissions: aprilReport.emissions,
    carbonScore: aprilReport.carbonScore,
    scoreCategory: aprilReport.scoreCategory,
    period: "monthly",
  });

  // May (Low emissions - optimized habits)
  const mayHabits: HabitEntryData = {
    streaming: { hoursPerDay: 1.5, quality: "720p" },
    gaming: { hoursPerDay: 1, platform: "console" },
    aiUsage: { promptsPerDay: 10, imageGensPerDay: 0, codingHours: 1 },
    cloudStorage: { storageGB: 120 },
    videoMeetings: { hoursPerWeek: 8 },
    emails: { sentPerDay: 15 },
    devices: { laptopHours: 4, desktopHours: 0, smartphoneHours: 2.5 },
  };
  const mayReport = calculateCarbonFootprint(mayHabits);
  const mayDate = new Date(now.getFullYear(), now.getMonth() - 1, 28);
  const mayHabitDoc = await HabitEntry.create({
    userId: normalUser._id,
    date: mayDate,
    ...mayHabits,
  });
  await CarbonReport.create({
    userId: normalUser._id,
    habitEntryId: mayHabitDoc._id,
    date: mayDate,
    emissions: mayReport.emissions,
    carbonScore: mayReport.carbonScore,
    scoreCategory: mayReport.scoreCategory,
    period: "monthly",
  });

  // B. Generate Daily History for the Last 14 Days (for charts and progress metrics)
  console.log("Generating daily reports for the last 14 days...");
  for (let i = 14; i >= 0; i--) {
    const reportDate = new Date(now);
    reportDate.setDate(now.getDate() - i);

    // Slightly randomize digital habits day-by-day to simulate natural usage patterns
    const dailySeed = i % 3;
    let dailyHabits: HabitEntryData;

    if (dailySeed === 0) {
      dailyHabits = {
        streaming: { hoursPerDay: 2, quality: "1080p" },
        gaming: { hoursPerDay: 1.5, platform: "pc" },
        aiUsage: { promptsPerDay: 15, imageGensPerDay: 1, codingHours: 2 },
        cloudStorage: { storageGB: 150 },
        videoMeetings: { hoursPerWeek: 12 },
        emails: { sentPerDay: 25 },
        devices: { laptopHours: 5, desktopHours: 2, smartphoneHours: 3 },
      };
    } else if (dailySeed === 1) {
      dailyHabits = {
        streaming: { hoursPerDay: 1, quality: "720p" },
        gaming: { hoursPerDay: 0.5, platform: "console" },
        aiUsage: { promptsPerDay: 8, imageGensPerDay: 0, codingHours: 1 },
        cloudStorage: { storageGB: 148 },
        videoMeetings: { hoursPerWeek: 10 },
        emails: { sentPerDay: 12 },
        devices: { laptopHours: 4, desktopHours: 0, smartphoneHours: 2 },
      };
    } else {
      dailyHabits = {
        streaming: { hoursPerDay: 3, quality: "1080p" },
        gaming: { hoursPerDay: 0, platform: "console" },
        aiUsage: { promptsPerDay: 22, imageGensPerDay: 2, codingHours: 0 },
        cloudStorage: { storageGB: 155 },
        videoMeetings: { hoursPerWeek: 15 },
        emails: { sentPerDay: 30 },
        devices: { laptopHours: 6, desktopHours: 0, smartphoneHours: 4 },
      };
    }

    const calcResult = calculateCarbonFootprint(dailyHabits);
    const habitDoc = await HabitEntry.create({
      userId: normalUser._id,
      date: reportDate,
      ...dailyHabits,
    });

    await CarbonReport.create({
      userId: normalUser._id,
      habitEntryId: habitDoc._id,
      date: reportDate,
      emissions: calcResult.emissions,
      carbonScore: calcResult.carbonScore,
      scoreCategory: calcResult.scoreCategory,
      period: "daily",
    });
  }

  // 5. Generate Challenges for Active User
  console.log("Generating green challenges...");

  // A. Generate Completed Challenges
  const completedTemplates = CHALLENGE_TEMPLATES.slice(0, 5);
  for (let i = 0; i < completedTemplates.length; i++) {
    const template = completedTemplates[i];
    const completedDate = new Date(now);
    completedDate.setDate(now.getDate() - i - 1); // completed in past days

    await Challenge.create({
      userId: normalUser._id,
      title: template.title,
      description: template.description,
      category: template.category,
      xpReward: template.xpReward,
      isCompleted: true,
      completedAt: completedDate,
      assignedDate: completedDate,
    });
  }

  // B. Generate Today's Uncompleted Challenges (3 active ones)
  const activeTemplates = CHALLENGE_TEMPLATES.slice(5, 8);
  for (const template of activeTemplates) {
    await Challenge.create({
      userId: normalUser._id,
      title: template.title,
      description: template.description,
      category: template.category,
      xpReward: template.xpReward,
      isCompleted: false,
      assignedDate: now,
    });
  }

  // 6. Generate Achievements for Active User
  console.log("Generating achievements progress...");
  
  // First Report - Unlocked
  const firstReportDef = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === "first_report")!;
  await Achievement.create({
    userId: normalUser._id,
    achievementId: firstReportDef.id,
    title: firstReportDef.title,
    description: firstReportDef.description,
    icon: firstReportDef.icon,
    unlockedAt: new Date(now.getFullYear(), now.getMonth() - 3, 28),
    progress: 1,
    target: firstReportDef.target,
  });

  // Streak 7 - Locked but has progress 5/7
  const streak7Def = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === "streak_7")!;
  await Achievement.create({
    userId: normalUser._id,
    achievementId: streak7Def.id,
    title: streak7Def.title,
    description: streak7Def.description,
    icon: streak7Def.icon,
    progress: 5,
    target: streak7Def.target,
  });

  // XP Hunter - Unlocked (user has 680 XP)
  const xpHunterDef = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === "xp_500")!;
  await Achievement.create({
    userId: normalUser._id,
    achievementId: xpHunterDef.id,
    title: xpHunterDef.title,
    description: xpHunterDef.description,
    icon: xpHunterDef.icon,
    unlockedAt: new Date(now.getFullYear(), now.getMonth() - 1, 10),
    progress: 680,
    target: xpHunterDef.target,
  });

  // Challenge Master - Locked but has progress 5/25
  const chalMasterDef = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === "challenge_master")!;
  await Achievement.create({
    userId: normalUser._id,
    achievementId: chalMasterDef.id,
    title: chalMasterDef.title,
    description: chalMasterDef.description,
    icon: chalMasterDef.icon,
    progress: 5,
    target: chalMasterDef.target,
  });

  // Initialize remaining achievements at 0 progress
  const seededIds = ["first_report", "streak_7", "xp_500", "challenge_master"];
  const remainingDefs = ACHIEVEMENT_DEFINITIONS.filter((def) => !seededIds.includes(def.id));

  for (const def of remainingDefs) {
    await Achievement.create({
      userId: normalUser._id,
      achievementId: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      progress: 0,
      target: def.target,
    });
  }

  // 7. Seed some baseline statistics for the admin user as well, so their charts look fine too
  console.log("Generating simple logs for Admin User...");
  const adminHabits: HabitEntryData = {
    streaming: { hoursPerDay: 2, quality: "1080p" },
    gaming: { hoursPerDay: 1, platform: "console" },
    aiUsage: { promptsPerDay: 10, imageGensPerDay: 2, codingHours: 1 },
    cloudStorage: { storageGB: 200 },
    videoMeetings: { hoursPerWeek: 10 },
    emails: { sentPerDay: 30 },
    devices: { laptopHours: 6, desktopHours: 0, smartphoneHours: 3 },
  };
  const adminCalc = calculateCarbonFootprint(adminHabits);
  const adminHabitDoc = await HabitEntry.create({
    userId: adminUser._id,
    date: now,
    ...adminHabits,
  });
  await CarbonReport.create({
    userId: adminUser._id,
    habitEntryId: adminHabitDoc._id,
    date: now,
    emissions: adminCalc.emissions,
    carbonScore: adminCalc.carbonScore,
    scoreCategory: adminCalc.scoreCategory,
    period: "monthly",
  });

  console.log("🔌 Disconnecting from MongoDB...");
  await mongoose.disconnect();
  console.log("✅ Database seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seed script failed:", err);
  process.exit(1);
});
