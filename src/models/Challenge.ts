import mongoose, { Schema, Document, Model } from "mongoose";
import { ChallengeCategory } from "@/types";

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: ChallengeCategory;
  xpReward: number;
  isCompleted: boolean;
  completedAt?: Date;
  assignedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["streaming", "gaming", "ai", "cloud", "video", "email", "device"],
      required: true,
    },
    xpReward: { type: Number, required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    assignedDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Index for optimizing user daily challenge retrieval
ChallengeSchema.index({ userId: 1, assignedDate: 1 });

const Challenge: Model<IChallenge> =
  mongoose.models.Challenge || mongoose.model<IChallenge>("Challenge", ChallengeSchema);
export default Challenge;
