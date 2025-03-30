import dbConnect from "@/lib/mongodb";
import Design from "@/models/Design";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { designId, userId }: { designId: string; userId: string } =
    await req.json();

  try {
    await dbConnect();

    const design = await Design.findById(designId);
    if (!design) {
      return NextResponse.json(
        { message: "Design not found." },
        { status: 404 }
      );
    }

    if (!design.invitedUsers.includes(userId)) {
      return NextResponse.json(
        { message: "User was not invited." },
        { status: 400 }
      );
    }

    if (design.acceptedUsers.includes(userId)) {
      return NextResponse.json(
        { message: "User already accepted the invite." },
        { status: 400 }
      );
    }

    design.acceptedUsers.push(userId);
    await design.save();

    return NextResponse.json(
      { message: "Invitation accepted successfully!", design },
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
