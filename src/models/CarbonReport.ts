import mongoose, { Schema, Document, Model } from "mongoose";
import { ScoreCategory, ReportPeriod } from "@/types";

export interface ICarbonReport extends Document {
  userId: mongoose.Types.ObjectId;
  habitEntryId: mongoose.Types.ObjectId;
  date: Date;
  emissions: {
    streaming: number;
    gaming: number;
    aiUsage: number;
    cloudStorage: number;
    videoCalls: number;
    emails: number;
    devices: number;
    total: number;
  };
  carbonScore: number;
  scoreCategory: ScoreCategory;
  period: ReportPeriod;
  createdAt: Date;
  updatedAt: Date;
}

const CarbonReportSchema = new Schema<ICarbonReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    habitEntryId: { type: Schema.Types.ObjectId, ref: "HabitEntry", required: true },
    date: { type: Date, default: Date.now },
    emissions: {
      streaming: { type: Number, required: true },
      gaming: { type: Number, required: true },
      aiUsage: { type: Number, required: true },
      cloudStorage: { type: Number, required: true },
      videoCalls: { type: Number, required: true },
      emails: { type: Number, required: true },
      devices: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    carbonScore: { type: Number, required: true },
    scoreCategory: {
      type: String,
      enum: [
        "Eco Champion",
        "Green User",
        "Average User",
        "Heavy Digital Consumer",
        "Carbon Intensive User",
      ],
      required: true,
    },
    period: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "monthly",
    },
  },
  { timestamps: true }
);

// Index for optimizing user report retrieval and sorting by date
CarbonReportSchema.index({ userId: 1, date: -1 });

const CarbonReport: Model<ICarbonReport> =
  mongoose.models.CarbonReport || mongoose.model<ICarbonReport>("CarbonReport", CarbonReportSchema);
export default CarbonReport;
