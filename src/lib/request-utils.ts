import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

/**
 * Safely parses the request body, checks the content length against a limit,
 * and validates the body against a Zod schema.
 */
export async function parseAndValidate<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
  maxBytes = 50 * 1024 // default 50KB limit
): Promise<
  | { success: true; data: T; response?: never }
  | { success: false; response: NextResponse; data?: never }
> {
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > maxBytes) {
    return {
      success: false,
      response: NextResponse.json({ error: "Payload too large" }, { status: 413 }),
    };
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      success: false,
      response: NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 }),
    };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      ),
    };
  }

  return { success: true, data: result.data };
}
