import dbConnect from "@/lib/mongodb";
import Design from "@/models/Design";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const {
    designId,
    invitedUserId,
  }: { designId: string; invitedUserId: string } = await req.json();

  try {
    await dbConnect();

    const design = await Design.findById(designId);
    if (!design) {
      return NextResponse.json(
        { message: "Design not found." },
        { status: 404 }
      );
    }

    if (design.invitedUsers.includes(invitedUserId)) {
      return NextResponse.json(
        { message: "User already invited." },
        { status: 400 }
      );
    }

    design.invitedUsers.push(invitedUserId);
    await design.save();

    return NextResponse.json(
      { message: "User invited successfully!", design },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
