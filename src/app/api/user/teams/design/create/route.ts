import dbConnect from "@/lib/mongodb";
import Design from "@/models/Design";
import Teams from "@/models/Team";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const {
    team,
  }: {
    team: string;
  } = await req.json();
  const userId = req.cookies.get("userId")?.value;

  try {
    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const teamExist = await Teams.findById(team);
    if (!teamExist) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    const newDesign = await Design.create({
      team,
      title: "Untitled",
      creator: user._id,
    });

    return NextResponse.json(
      { message: "Design created successfully!", data: newDesign },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
