import bcrypt from "bcrypt";
// import crypto from "crypto";

import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import Teams from "@/models/Team";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const {
    email,
    password,
    username,
  }: { email: string; password: string; username: string } = await req.json();
  try {
    await dbConnect();

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "Username/email already exists." },
        { status: 400 }
      );
    }

    // const verificationToken = crypto.randomBytes(32).toString("hex");
    // const verificationTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = await User.create({
      email,
      username,
      password: hashedPassword,
      isVerified: true, // false
      // verificationToken,
      // verificationTokenExpiry,
    });

    const team = await Teams.create({
      type: "default",
      name: `${user.fullName} Teams`,
      description: user.bio,
      creator: user.id,
    });

    // const verificationUrl = `${process.env.BASE_URL}/verify?token=${verificationToken}`;
    // await sendEmail({
    //   to: email,
    //   subject: "Verify your email",
    //   text: `Click the link to verify your email: ${verificationUrl}`,
    //   html: `<p>Click the link below to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
    // });

    user.signUpDate = new Date();
    user.teams = [team.id];
    await user.save();

    return NextResponse.json(
      {
        message: "User created successfully!",
        data: { ...user.toObject(), password: undefined },
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
