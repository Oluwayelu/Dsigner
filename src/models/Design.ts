import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDesign extends Document {
	title: string;
	team: mongoose.Types.ObjectId;
	creator: mongoose.Types.ObjectId;
	invitedUsers: string[];
	acceptedUsers: mongoose.Types.ObjectId[];
	seenBy?: mongoose.Types.ObjectId[];
	privacy: "private" | "public";
	description?: string;
	lastEdited: Date;
	createdAt: Date;
	updatedAt: Date;
}

const DesignSchema: Schema<IDesign> = new mongoose.Schema(
	{
		title: { type: String, required: true },
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
			required: true,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		invitedUsers: [{ type: String }],
		acceptedUsers: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
		],
		seenBy: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
		],
		privacy: { type: String, enum: ["private", "public"], default: "private" },
		description: { type: String },
		lastEdited: { type: Date, default: new Date() },
	},
	{ timestamps: true }
);

const Design: Model<IDesign> =
	mongoose.models.Design || mongoose.model<IDesign>("Design", DesignSchema);

export default Design;
