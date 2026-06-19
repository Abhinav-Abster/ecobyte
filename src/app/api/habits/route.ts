import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const habits = await HabitEntry.find({ userId: session.user.id })
      .sort({ date: -1 })
      .limit(50);

    return NextResponse.json({ success: true, data: habits });
  } catch (error: any) {
    console.error("GET habits error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    const habit = await HabitEntry.create({
      userId: session.user.id,
      date: body.date ? new Date(body.date) : new Date(),
      streaming: body.streaming,
      gaming: body.gaming,
      aiUsage: body.aiUsage,
      cloudStorage: body.cloudStorage,
      videoMeetings: body.videoMeetings,
      emails: body.emails,
      devices: body.devices,
    });

    return NextResponse.json({ success: true, data: habit }, { status: 201 });
  } catch (error: any) {
    console.error("POST habits error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
