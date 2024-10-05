import { NextResponse } from 'next/server';
import sharp from 'sharp';
import connectToDb from '../../../utils/mongo';
import imageSchema from '../../../utils/schema'
export const POST = async (req) => {
  try {
   await connectToDb()
    const {imageUrl} = await req.json();
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    const {width,height} = await sharp(imageBuffer).metadata();
    const configuration= new imageSchema({
      imgUrl:imageUrl,
      width:width,
      height:height
    })
    await configuration.save()

    return NextResponse.json({ message: 'Data received',configuration: configuration._id }); // Send a JSON response
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
};
