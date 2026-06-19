import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    achievementId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    unlockedAt: { type: Date },
    progress: { type: Number, default: 0 },
    target: { type: Number, required: true },
  },
  { timestamps: true }
);

// Unique index to ensure one achievement entry per user per achievement type
AchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);
export default Achievement;
