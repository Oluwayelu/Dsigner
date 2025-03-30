import dbConnect from "@/lib/mongodb";
import Team from "@/models/Team";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const {
    bio,
    avatar,
    fullName,
  }: { bio: string; avatar: string; fullName: string } = await req.json();
  const userId = req.cookies.get("userId")?.value;

  try {
    await dbConnect();

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    user.bio = bio;
    user.fullName = fullName;
    user.avatar = avatar || user.avatar;
    user.isOnboarded = true;

    const team = await Team.create({
      type: "default",
      name: `${user.fullName} Teams`,
      description: user.bio,
      creator: user.id,
    });

    if (!team) {
      return NextResponse.json(
        { message: "Error occured onboarding user" },
        { status: 400 }
      );
    }

    user.teams = [team.id];
    const updatedUser = await user.save();

    return NextResponse.json(
      {
        message: "User onboarded successfully!",
        data: { ...updatedUser.toObject() },
      },
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
