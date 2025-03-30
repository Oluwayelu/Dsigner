/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<NextResponse> {
  const user = (req as any).user; // Access user added by middleware
  return NextResponse.json({ message: "This is a protected route!", user });
}
