import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	role: "user" | "admin";
	fullName?: string;
	avatar?: string;
	bio?: string;
	isVerified: boolean;
	isOnboarded: boolean;
	isActive: boolean;
	signUpDate: Date;
	lastLogin?: Date;
	teams?: mongoose.Types.ObjectId[];
	notificationPreferences: {
		email: boolean;
		inApp: boolean;
	};
	resetPasswordToken?: string;
	resetPasswordExpires?: Date;
	verificationToken?: string;
	verificationTokenExpiry?: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, enum: ["user", "admin"], default: "user" },
		teams: [{ type: Schema.Types.ObjectId, ref: "Team", default: [] }],
		fullName: { type: String },
		avatar: { type: String },
		bio: { type: String },
		isVerified: { type: Boolean, default: false },
		isOnboarded: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		signUpDate: { type: Date, default: Date.now },
		lastLogin: { type: Date },
		notificationPreferences: {
			email: { type: Boolean, default: false },
			inApp: { type: Boolean, default: true },
		},
		resetPasswordToken: { type: String },
		resetPasswordExpires: { type: Date },
	},
	{ timestamps: true }
);

const UserModel: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
