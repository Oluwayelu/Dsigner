import dbConnect from "@/lib/mongodb";
import Design from "@/models/Design";
import Team from "@/models/Team";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const userId = req.cookies.get("userId")?.value;
  try {
    await dbConnect();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    console.log("Users: ", user);
    const createdDesigns = await Design.find({});
    console.log("creddes: ", createdDesigns);
    const teams = await Team.find({ members: user._id });
    console.log("Teams: ", teams);
    const teamDesigns = await Design.find({
      team: { $in: teams.map((t) => t._id) },
    }).populate("team");
    console.log("Teamdesin: ", teamDesigns);
    return NextResponse.json(
      {
        message: "Dashbaord fetched successfully",
        data: { user, createdDesigns, teams, teamDesigns },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
