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

		const personalTeam = await Team.find({
			type: "default",
			creator: user._id,
		});
		const personalDesigns = await Design.find({
			team: { $in: personalTeam.map((t) => t._id) },
		}).populate("team");

		const teams = await Team.find({ members: user._id });
		const teamDesigns = await Design.find({
			$or: [
				{ creator: user._id, type: "custom" },
				{ team: { $in: teams.map((t) => t._id) } },
			],
		}).populate("team");

		// const draftDesign = await Design.find({ isDraft: true, creator: user._id });

		const designs = [...personalDesigns, ...teamDesigns];

		console.log("Designs: ", designs);
		designs.sort((a, b) =>
			new Date(a.lastEdited).getTime() - new Date(b.lastEdited).getTime() < 0
				? 1
				: -1
		);

		return NextResponse.json(
			{
				message: "Dashbaord fetched successfully",
				data: {
					user,
					designs,
					teams,
					teamDesigns: teamDesigns.length,
					personalDesigns: personalDesigns.length,
				},
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
