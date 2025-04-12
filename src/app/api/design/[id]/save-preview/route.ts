import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const formData = await req.formData();
		const file = formData.get("preview") as Blob;

		if (!file || !params.id) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Convert blob to buffer
		const buffer = Buffer.from(await file.arrayBuffer());

		// Create path to public folder
		const publicDir = path.join(process.cwd(), "public", "previews");
		const filePath = path.join(publicDir, `${params.id}.jpg`);

		// Write file to public folder
		await writeFile(filePath, buffer);

		return NextResponse.json(
			{
				success: true,
				message: "Preview saved successfully",
				data: `/previews/${params.id}.jpg`,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Save error:", error);
		return NextResponse.json(
			{ message: "Failed to save preview" },
			{ status: 500 }
		);
	}
}
