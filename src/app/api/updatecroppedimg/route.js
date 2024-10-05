import { NextResponse } from 'next/server';

import connectToDb from '../../../utils/mongo';
import imageSchema from '../../../utils/schema'
export const POST = async (req) => {
  try {
   await connectToDb()
    const {imageUrl,id,model,material,finish,color} = await req.json();

    const data= await imageSchema.findById(id)
    data.croppedImageUrl = imageUrl
    data.color=color;
    data.material=material;
    data.model=model;
    data.finish=finish;
    const newData=await data.save()

    console.log(newData)
    return NextResponse.json({ message: 'Data received'}); 
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
};
