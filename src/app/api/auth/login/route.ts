import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import { signJwt } from "@/lib/utils";

export async function POST(req: NextRequest): Promise<NextResponse> {
	const { identifier, password }: { identifier: string; password: string } =
		await req.json();

	try {
		await dbConnect();
		let user;

		user = await User.findOne({
			$or: [{ username: identifier }, { email: identifier }],
		});

		if (user?.teams && user.teams.length > 0) {
			user = await User.findOne({
				$or: [{ username: identifier }, { email: identifier }],
			})
				.populate("teams")
				.exec();
		}

		if (!user) {
			return NextResponse.json({ message: "User not found." }, { status: 404 });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: "Invalid credentials." },
				{ status: 401 }
			);
		}

		const token = await signJwt({
			userId: user._id as string,
			email: user.email,
		});

		user.lastLogin = new Date();
		await user.save();

		const response = NextResponse.json(
			{
				message: "Login successful!",
				data: { token, ...user.toObject(), password: undefined },
			},
			{ status: 200 }
		);

		response.cookies.set("token", token, {
			expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
		});

		return response;
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Internal server error." },
			{ status: 500 }
		);
	}
}
