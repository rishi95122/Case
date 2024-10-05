"use client"
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

import { Image, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'

const Upload = () => {
  
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const router=useRouter()

  const handleUpload = async (acceptedFiles) => {
    setUploading(true);
    const data=new FormData()
    data.append("file",acceptedFiles[0])
    data.append("upload_preset","phoneecomm")
    data.append("cloud_name","dlol3hguo ")
   
    fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API,{
    method:"post",
    body:data}
    ).then((res)=>res.json()).then(async(data)=>{
  
        if(data.public_id)
        {
          const response = await fetch('/api/getmetadata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
              imageUrl: `https://res.cloudinary.com/dlol3hguo/image/upload/v1726918664/${data.public_id}.png`,
            }),
          });
          const {configuration}=await response.json()
          console.log(configuration)
          router.push(`/configure/design?id=${configuration}`)
        }

        setImageUrl(data.public_id)
        setUploading(false);
    }).catch((err)=>{
        console.log(err)
    })
  };

  return (
    <div className={'flex justify-center items-center '}>
      <Dropzone onDrop={acceptedFiles => handleUpload(acceptedFiles)} className=''>
        {({ getRootProps, getInputProps }) => (
          <div className='w-full bg-green-100'>
            <div {...getRootProps()} className='shadow-xl rounded-xl  flex items-center justify-center h-[calc(100vh-40vh)] max-xl:h-[calc(100vh-60vh)] w-full  text-center'>
              <input {...getInputProps()} />
              <div className='flex justify-center flex-col items-center gap-3'>
                {
                  uploading?<Loader className='animate-spin '/> :<Image />
                }
                <p className='font-semibold'>Drag {'n'} drop some files here, or click to select files</p>
                <p className='text-sm'>JPG JPEG PNG</p>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default Upload;
