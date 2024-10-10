"use client";

import { Image, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Dropzone from "react-dropzone";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null); // New state for error messages
  const router = useRouter();

  const handleUpload = async (acceptedFiles) => {
    setUploading(true);
    setError(null); // Clear any previous error

    try {
      const data = new FormData();
      data.append("file", acceptedFiles[0]);
      data.append("upload_preset", "phoneecomm");
      data.append("cloud_name", "dlol3hguo");

      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API, {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Cloudinary API request failed");
      }

      const uploadResult = await res.json();

      if (uploadResult.public_id) {
        // Correct usage of template literals
        const imageUrl = `https://res.cloudinary.com/dlol3hguo/image/upload/v1726918664/${uploadResult.public_id}.png`;

        const metadataResponse = await fetch("/api/getmetadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        });

        if (!metadataResponse.ok) {
          throw new Error("Failed to retrieve image metadata");
        }

        const { configuration } = await metadataResponse.json();
        console.log(configuration);
        router.push(`/configure/design?id=${configuration}`);
      } else {
        throw new Error("Invalid response from Cloudinary");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message); // Set error message for display
    } finally {
      setUploading(false); // Always set uploading to false after processing
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Dropzone onDrop={(acceptedFiles) => handleUpload(acceptedFiles)}>
        {({ getRootProps, getInputProps }) => (
          <div className="w-full bg-green-100">
            <div
              {...getRootProps()}
              className="shadow-xl rounded-xl flex items-center justify-center h-[calc(100vh-40vh)] max-xl:h-[calc(100vh-60vh)] w-full text-center"
            >
              <input {...getInputProps()} />
              <div className="flex justify-center flex-col items-center gap-3">
                {uploading ? <Loader className="animate-spin" /> : <Image />}
                <p className="font-semibold">
                  Drag {"n"} drop some files here, or click to select files
                </p>
                <p className="text-sm">JPG JPEG PNG</p>
              </div>
              {error && <p className="text-red-500">{error}</p>}{" "}
              {/* Display error */}
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default Upload;
