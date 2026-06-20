import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";
import { habitEntrySchema } from "@/lib/validations";
import { parseAndValidate } from "@/lib/request-utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const habits = await HabitEntry.find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, data: habits });
  } catch (error: unknown) {
    console.error("GET habits error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidate(req, habitEntrySchema);
    if (!validation.success) {
      return validation.response;
    }

    await connectDB();

    const habit = await HabitEntry.create({
      userId: session.user.id,
      date: validation.data.date ? new Date(validation.data.date) : new Date(),
      streaming: validation.data.streaming,
      gaming: validation.data.gaming,
      aiUsage: validation.data.aiUsage,
      cloudStorage: validation.data.cloudStorage,
      videoMeetings: validation.data.videoMeetings,
      emails: validation.data.emails,
      devices: validation.data.devices,
    });

    return NextResponse.json({ success: true, data: habit }, { status: 201 });
  } catch (error: unknown) {
    console.error("POST habits error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
