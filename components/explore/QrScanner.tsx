"use client";
import React, { useEffect, useState, useRef } from "react";
import jsQR from "jsqr";
import { Image } from "@/types/media";

const handleGetMedia = async (mediaId: string): Promise<Image[] | null> => {
  try {
    const response = await fetch(`/api/media/info/${mediaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.images;
  } catch (error) {
    console.error("Error fetching media:", error);
    return null;
  }
};

const QRCodeScanner: React.FC = () => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [images, setImages] = useState<Image[] | null>(null);
  const [boundingBox, setBoundingBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousQrDataRef = useRef<string | null>(null); // Use a ref to track the previous QR data
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for throttling QR data processing
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasContext = canvas?.getContext("2d");

    const handleVideoPlay = () => {
      if (video && canvas && canvasContext) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        requestAnimationFrame(tick);
      }
    };

    // Set up camera stream
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (video) {
          video.srcObject = stream;
          video.setAttribute("playsinline", "true"); // Required to tell iOS safari we don't want fullscreen
          video.play();
          video.addEventListener("loadeddata", handleVideoPlay); // Wait for video to load
        }
      });

    const tick = () => {
      if (video && canvas && canvasContext && video.videoWidth > 0 && video.videoHeight > 0) {
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

        if (qrCode) {
          const { data, location } = qrCode;

          // Throttle the QR data processing
          if (data && data !== previousQrDataRef.current) {
            if (!throttleTimeoutRef.current) {
              // Process the QR data and throttle updates
              setQrData(data);
              handleGetMedia(data).then(setImages);

              // Update the previous QR data ref
              previousQrDataRef.current = data;

              // Set up a throttle timer (e.g., 2 seconds delay)
              throttleTimeoutRef.current = setTimeout(() => {
                throttleTimeoutRef.current = null;
              }, 2000);
            }
          }

          // Update the bounding box on every frame, regardless of QR data changes
          setBoundingBox({
            x: location.topLeftCorner.x,
            y: location.topLeftCorner.y,
            width: location.bottomRightCorner.x - location.topLeftCorner.x,
            height: location.bottomRightCorner.y - location.topLeftCorner.y,
          });
        }

        requestAnimationFrame(tick); // Continue scanning
      }
    };

    return () => {
      if (video && video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval); // Clean up the interval on component unmount
    }
  }, [images]);

  return (
    <div style={{ position: "relative", backgroundColor: "black" }} >
      {/* <h2 className="text-xl font-semibold mb-2">QR Code Scanner with Bounding Box</h2> */}
      <video ref={videoRef} style={{ width: "100%", height: "auto", maxHeight: "100vh" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* QR Detected Indicator */}
      {qrData && (
        <div className="absolute top-2.5 left-2.5 text-[#16ed48] font-bold z-[1000]">
          QR Detected
        </div>
      )}


      {/* Scanned Data Display */}
      <div className="p-4 text-white">
      {/* {qrData && (
        <div className="mt-4">
          <h3 className="font-bold">Scanned Data:</h3>
          <p>{qrData}</p>
        </div>
      )} */}

      {/* Display Images */}
      {images && (
        <div>
          {images.map((image) => (
            <div key={image.id} className="bg-gray-800 rounded-lg shadow-md p-4 mb-4">
              <h3 className="text-lg font-bold text-blue-400 mb-2">{image.title}</h3>
              <p className="text-sm italic text-gray-300 mb-3">{image.description}</p>
              <img src={image.url} alt={image.id} className="w-full h-auto rounded-md" />
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Render First Image in Bounding Box */}
      {boundingBox && images && images.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: boundingBox.y - boundingBox.width,
            left: boundingBox.x - boundingBox.height,
            width: boundingBox.width * 2,
            height: boundingBox.height * 2,
            overflow: "hidden",
            pointerEvents: "none", // Ensure it doesn't interfere with scanning
            zIndex: 1000,
          }}
        >
          <img
            src={images[currentImageIndex].url}
            alt={images[currentImageIndex].id}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
