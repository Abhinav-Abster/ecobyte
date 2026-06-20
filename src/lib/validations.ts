// =============================================================================
// EcoByte - Input Validation Schemas (Zod)
// Centralized validation for API request payloads
// =============================================================================

import { z } from "zod";

// ---- Auth ----

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password is too long"),
});

// ---- Habit Entry ----

const streamingQualitySchema = z.enum(["480p", "720p", "1080p", "4K"]);
const gamingPlatformSchema = z.enum(["pc", "console", "cloud"]);

export const habitEntrySchema = z.object({
  date: z.string().datetime().optional(),
  streaming: z.object({
    hoursPerDay: z.number().min(0).max(24),
    quality: streamingQualitySchema,
  }),
  gaming: z.object({
    hoursPerDay: z.number().min(0).max(24),
    platform: gamingPlatformSchema,
  }),
  aiUsage: z.object({
    promptsPerDay: z.number().min(0).max(10000),
    imageGensPerDay: z.number().min(0).max(10000),
    codingHours: z.number().min(0).max(24),
  }),
  cloudStorage: z.object({
    storageGB: z.number().min(0).max(100000),
  }),
  videoMeetings: z.object({
    hoursPerWeek: z.number().min(0).max(168),
  }),
  emails: z.object({
    sentPerDay: z.number().min(0).max(100000),
  }),
  devices: z.object({
    laptopHours: z.number().min(0).max(24),
    desktopHours: z.number().min(0).max(24),
    smartphoneHours: z.number().min(0).max(24),
  }),
});

// ---- Calculate ----

export const calculateSchema = z.object({
  habitEntryId: z.string().min(1, "habitEntryId is required"),
});

// ---- Simulation ----

export const simulationSchema = z.object({
  months: z.number().refine((v) => v === 6 || v === 12, {
    message: "Months must be 6 or 12",
  }),
});

// ---- Reports ----

export const reportQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  period: z.enum(["daily", "weekly", "monthly"]).optional(),
});

// ---- Pagination ----

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
