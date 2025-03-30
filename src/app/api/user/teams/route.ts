import dbConnect from "@/lib/mongodb";
import Teams from "@/models/Team";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const userId = req.cookies.get("userId")?.value;
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const createdTeams = await Teams.find({ creator: user.id });
    const memberTeams = await Teams.find({ members: user.id });
    const teams = createdTeams.concat(memberTeams);

    return NextResponse.json({ data: teams }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const userId = req.cookies.get("userId")?.value;
  const body = req.json();
  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const teams = await Teams.create({
      ...body,
      type: "custom",
      creator: user.id,
    });

    return NextResponse.json(
      { message: "Team created successfully", data: teams },
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
