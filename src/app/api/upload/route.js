
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST=async(req, res) =>{
    console.log("DASD",req.body)

    try {
      const file = req.body.file; 
      const uploadResponse = await cloudinary.uploader.upload(file, {
        folder: 'nextjs_uploads', 
      });
      return NextResponse({ url: uploadResponse.secure_url });
    } catch (error) {
      return NextResponse({ error: 'Failed to upload image' });
    }
 
}
