import jsPDF from "jspdf";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { jwtVerify, SignJWT } from "jose";
import { IJWTPayload } from "@/types/type";

const adjectives = [
	"Happy",
	"Creative",
	"Energetic",
	"Lively",
	"Dynamic",
	"Radiant",
	"Joyful",
	"Vibrant",
	"Cheerful",
	"Sunny",
	"Sparkling",
	"Bright",
	"Shining",
];

const animals = [
	"Dolphin",
	"Tiger",
	"Elephant",
	"Penguin",
	"Kangaroo",
	"Panther",
	"Lion",
	"Cheetah",
	"Giraffe",
	"Hippopotamus",
	"Monkey",
	"Panda",
	"Crocodile",
];

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateRandomName(): string {
	const randomAdjective =
		adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

	return `${randomAdjective} ${randomAnimal}`;
}

export const getShapeInfo = (shapeType: string) => {
	switch (shapeType) {
		case "rect":
			return {
				icon: "/assets/rectangle.svg",
				name: "Rectangle",
			};

		case "circle":
			return {
				icon: "/assets/circle.svg",
				name: "Circle",
			};

		case "triangle":
			return {
				icon: "/assets/triangle.svg",
				name: "Triangle",
			};

		case "line":
			return {
				icon: "/assets/line.svg",
				name: "Line",
			};

		case "i-text":
			return {
				icon: "/assets/text.svg",
				name: "Text",
			};

		case "image":
			return {
				icon: "/assets/image.svg",
				name: "Image",
			};

		case "freeform":
			return {
				icon: "/assets/freeform.svg",
				name: "Free Drawing",
			};

		default:
			return {
				icon: "/assets/rectangle.svg",
				name: shapeType,
			};
	}
};

export const exportToPdf = () => {
	const canvas = document.querySelector("canvas");

	if (!canvas) return;

	// use jspdf
	const doc = new jsPDF({
		orientation: "landscape",
		unit: "px",
		format: [canvas.width, canvas.height],
	});

	// get the canvas data url
	const data = canvas.toDataURL();

	// add the image to the pdf
	doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);

	// download the pdf
	doc.save("canvas.pdf");
};

const secret = process.env.JWT_SECRET || "The Cow Says Moo!";
export async function signJwt(data: { userId: string; email: string }) {
	const token = await new SignJWT(data)
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("30D")
		.sign(new TextEncoder().encode(secret));
	return token;
}

export async function verifyJwt(token: string) {
	// try {
	//   const verified = await jwtVerify(token, new TextEncoder().encode(secret));
	//   return verified.payload as IJWTPayload;
	// } catch (error) {
	//   console.log(error);
	//   return false;
	// }
	const verified = await jwtVerify(token, new TextEncoder().encode(secret));
	return verified.payload as IJWTPayload;
}

export function getInitials(name: string) {
	if (name.length === 0) return "";

	const nameArr = name.split(" ");
	if (nameArr.length === 1) {
		return nameArr[0][0];
	} else {
		return nameArr[0][0] + nameArr[1][0];
	}
}
