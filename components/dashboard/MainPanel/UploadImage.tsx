"use client";
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";

function UploadImageContent() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const mediaId = searchParams.get("mediaId");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !mediaId) return;

    setIsUploading(true);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const response = await fetch(`/api/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId,
          file: {
            name: file.name,
            type: file.type,
            base64Data,
          },
          title,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      console.log("Image uploaded successfully:", data);
      setIsDialogOpen(false);
      setTitle(null);
      setDescription(null);
      setFile(null);
      setUploadedImage(null);
      // router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Choose an image file to upload to your dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="image-upload">Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          {uploadedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <p className="text-green-500 mt-2">Image ready to upload</p>
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!file || !title || !description || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UploadImage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mt-8 w-full flex flex-row items-begin justify-between">
        <h3 className="text-xl font-semibold ">Upload Image: </h3>
        <UploadImageContent />
      </div>
    </Suspense>
  );
}

export default UploadImage;
