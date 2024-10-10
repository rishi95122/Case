import { NextResponse } from "next/server";
import sharp from "sharp";
import connectToDb from "../../../utils/mongo";
import imageSchema from "../../../utils/schema";

export const POST = async (req) => {
  try {
    // Ensure the database connection
    await connectToDb();

    // Parse and validate the incoming request body
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Fetch the image from the provided URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from URL" },
        { status: 400 }
      );
    }

    // Process image using Sharp
    const imageBuffer = await response.arrayBuffer();
    const sharpBuffer = Buffer.from(imageBuffer);

    const metadata = await sharp(sharpBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Failed to retrieve image metadata" },
        { status: 500 }
      );
    }

    // Create and save image configuration in the database
    const configuration = new imageSchema({
      imgUrl: imageUrl,
      width: metadata.width,
      height: metadata.height,
    });
    await configuration.save();

    return NextResponse.json({
      message: "Data received",
      configuration: configuration._id,
    });
  } catch (error) {
    console.error("Error during request:", error.message);
    return NextResponse.json(
      { error: "An internal server error occurred" },
      { status: 500 }
    );
  }
};
