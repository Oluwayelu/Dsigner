import mongoose, { Model, Schema, Document } from "mongoose";

export interface ITeam extends Document {
	name: string;
	description?: string;
	type: "default" | "custom";
	members: {
		user: mongoose.Types.ObjectId;
		role: string;
		joinedAt: Date;
	}[];
	logo: string;
	website: string;
	isActive: boolean;
	plan: "free" | "premium";
	creator: mongoose.Types.ObjectId;
}

const TeamSchema: Schema<ITeam> = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String },
		type: { type: String, enum: ["default", "custom"], default: "custom" },
		members: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				role: { type: String, enum: ["admin", "member"], default: "member" },
				joinedAt: {
					type: Date,
					default: Date.now,
				},
			},
		],
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		logo: {
			type: String,
			default: "",
		},
		website: {
			type: String,
			trim: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		plan: { type: String, enum: ["free", "premium"], default: "free" },
	},
	{ timestamps: true }
);

const Teams: Model<ITeam> =
	mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);

export default Teams;
