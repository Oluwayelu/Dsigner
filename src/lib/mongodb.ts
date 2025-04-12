import mongoose from "mongoose";

const cached: { conn?: typeof mongoose; promise?: Promise<typeof mongoose> } =
	{};

const MONGODB_URI = process.env.MONGODB_URI;

async function dbConnect() {
	if (cached.conn) return cached.conn;

	if (!MONGODB_URI) {
		throw new Error("Please define the MONGODB_URI environment variable.");
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, {
			bufferCommands: false,
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = undefined;
		throw e;
	}

	return cached.conn;
}

export default dbConnect;
