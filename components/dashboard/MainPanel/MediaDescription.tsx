"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCodeGenerator from "./QRCodeGenerator";
import { Media } from "@/types/media";
import UploadImage from "./UploadImage";
import MediaInfoPanel from "./MediaInfoPanel";

const handleGetMedia = async (mediaId: string): Promise<Media | null> => {
  try {
    const response = await fetch(`/api/media/info/${mediaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("DATA asdf: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
};

function MediaDescriptionContent() {
  const searchParams = useSearchParams();
  const mediaId = searchParams.get("mediaId");
  const [media, setMedia] = useState<Media | null>(null);

  useEffect(() => {
    setMedia(null);
    if (mediaId) {
      handleGetMedia(mediaId).then(setMedia);
    }
  }, [mediaId]);

  return (
    <div>
      {!mediaId ? (
        <div className="text-center mt-8">
          <p className="text-xl font-semibold">Please select a media item</p>
        </div>
      ) : !media ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="mt-4">
            {/* Media data */}
            <MediaInfoPanel name={media.name} mediaid={mediaId} />
            {/* QR Code */}
            <QRCodeGenerator value={mediaId} />
          </div>
          <div className="mt-4">
            {/* Upload Image */}
            <UploadImage />

            {/* Images */}
            {media.images && media.images.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Images:</h2>
                <div className="overflow-x-auto whitespace-nowrap pb-4">
                  {media.images.map((image) => (
                    <div key={image.id} className="inline-block mr-4">
                      <img
                        src={image.url}
                        alt={image.title || "Uploaded image"}
                        className="w-64 h-64 object-cover rounded-lg shadow-md"
                      />
                      {image.title && (
                        <p className="mt-2 text-center font-medium">
                          {image.title}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MediaDescription() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MediaDescriptionContent />
    </Suspense>
  );
}

export default MediaDescription;
