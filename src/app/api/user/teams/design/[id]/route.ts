import dbConnect from "@/lib/mongodb";
import Design from "@/models/Design";
import Teams from "@/models/Team";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	const {
		title,
		description,
	}: {
		title?: string;
		description?: string;
	} = await req.json();
	const userId = req.cookies.get("userId")?.value;

	try {
		await dbConnect();

		const user = await User.findById(userId);
		if (!user) {
			return NextResponse.json({ message: "User not found." }, { status: 404 });
		}

		const design = await Design.findById(params.id);
		if (!design) {
			return NextResponse.json(
				{ message: "Design not found." },
				{ status: 404 }
			);
		}

		const teamExist = await Teams.findById(design.team);
		if (!teamExist) {
			return NextResponse.json({ message: "Team not found." }, { status: 404 });
		}

    console.log(userId, design.creator.toString(), teamExist.creator.toString());
		if (
			userId !== design.creator.toString() ||
			userId !== teamExist.creator.toString()
		) {
			return NextResponse.json(
				{ message: "You cannot edit this design info." },
				{ status: 403 }
			);
		}

		design.title = title || design.title;
		design.description = description || design.description;
		design.isDraft = false;
		design.lastEdited = new Date();

		const newDesign = await design.save();

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
