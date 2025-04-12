import dbConnect from "@/lib/mongodb";
import Design from "@/models/Design";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
): Promise<NextResponse> {
	const userId = req.cookies.get("userId")?.value;

	try {
		await dbConnect();

		const user = await User.findById(userId).populate("teams");

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

		if (!design.invitedUsers.includes(user.id)) {
			return NextResponse.json(
				{ message: "User was not invited." },
				{ status: 400 }
			);
		}

		if (design.acceptedUsers.includes(user.id)) {
			return NextResponse.json(
				{ message: "User already accepted the invite." },
				{ status: 400 }
			);
		}

		design.acceptedUsers.push(user.id);
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
