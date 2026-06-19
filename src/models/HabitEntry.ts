import mongoose, { Schema, Document, Model } from "mongoose";
import { StreamingQuality, GamingPlatform } from "@/types";

export interface IHabitEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  streaming: {
    hoursPerDay: number;
    quality: StreamingQuality;
  };
  gaming: {
    hoursPerDay: number;
    platform: GamingPlatform;
  };
  aiUsage: {
    promptsPerDay: number;
    imageGensPerDay: number;
    codingHours: number;
  };
  cloudStorage: {
    storageGB: number;
  };
  videoMeetings: {
    hoursPerWeek: number;
  };
  emails: {
    sentPerDay: number;
  };
  devices: {
    laptopHours: number;
    desktopHours: number;
    smartphoneHours: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const HabitEntrySchema = new Schema<IHabitEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    streaming: {
      hoursPerDay: { type: Number, default: 0 },
      quality: { type: String, enum: ["480p", "720p", "1080p", "4K"], default: "1080p" },
    },
    gaming: {
      hoursPerDay: { type: Number, default: 0 },
      platform: { type: String, enum: ["pc", "console", "cloud"], default: "pc" },
    },
    aiUsage: {
      promptsPerDay: { type: Number, default: 0 },
      imageGensPerDay: { type: Number, default: 0 },
      codingHours: { type: Number, default: 0 },
    },
    cloudStorage: {
      storageGB: { type: Number, default: 0 },
    },
    videoMeetings: {
      hoursPerWeek: { type: Number, default: 0 },
    },
    emails: {
      sentPerDay: { type: Number, default: 0 },
    },
    devices: {
      laptopHours: { type: Number, default: 0 },
      desktopHours: { type: Number, default: 0 },
      smartphoneHours: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Index for optimizing user habit logs retrieval and sorting by date
HabitEntrySchema.index({ userId: 1, date: -1 });

const HabitEntry: Model<IHabitEntry> =
  mongoose.models.HabitEntry || mongoose.model<IHabitEntry>("HabitEntry", HabitEntrySchema);
export default HabitEntry;
