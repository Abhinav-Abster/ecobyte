import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import { EMISSION_FACTORS } from "@/lib/emission-factors";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: EMISSION_FACTORS });
  } catch (error: unknown) {
    console.error("GET emission factors error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
