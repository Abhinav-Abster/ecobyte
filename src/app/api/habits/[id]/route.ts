import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { connectDB } from "@/lib/mongodb";
import HabitEntry from "@/models/HabitEntry";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const habit = await HabitEntry.findById(id);
    if (!habit) {
      return NextResponse.json({ error: "Habit entry not found" }, { status: 404 });
    }

    if (habit.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: habit });
  } catch (error: any) {
    console.error("GET habit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const habit = await HabitEntry.findById(id);
    if (!habit) {
      return NextResponse.json({ error: "Habit entry not found" }, { status: 404 });
    }

    if (habit.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    habit.streaming = body.streaming ?? habit.streaming;
    habit.gaming = body.gaming ?? habit.gaming;
    habit.aiUsage = body.aiUsage ?? habit.aiUsage;
    habit.cloudStorage = body.cloudStorage ?? habit.cloudStorage;
    habit.videoMeetings = body.videoMeetings ?? habit.videoMeetings;
    habit.emails = body.emails ?? habit.emails;
    habit.devices = body.devices ?? habit.devices;
    if (body.date) {
      habit.date = new Date(body.date);
    }

    await habit.save();

    return NextResponse.json({ success: true, data: habit });
  } catch (error: any) {
    console.error("PUT habit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const habit = await HabitEntry.findById(id);
    if (!habit) {
      return NextResponse.json({ error: "Habit entry not found" }, { status: 404 });
    }

    if (habit.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await HabitEntry.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Habit entry deleted successfully" });
  } catch (error: any) {
    console.error("DELETE habit error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
