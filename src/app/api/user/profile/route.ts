import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
	const userId = req.cookies.get("userId")?.value;
	try {
		await dbConnect();

		const user = await User.findById(userId).populate("teams");

		if (!user) {
			return NextResponse.json({ message: "User not found." }, { status: 404 });
		}

		return NextResponse.json({ data: user }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error." },
			{ status: 500 }
		);
	}
}
