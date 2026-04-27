import { cloudinary } from "../config/cloudinary.js";

interface UploadResult {
  secureUrl: string;
  publicId: string;
  bytes: number;
  originalFilename: string;
}

export const uploadBufferToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  folder = "foldera",
): Promise<UploadResult> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        public_id: fileName.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          bytes: result.bytes,
          originalFilename: result.original_filename,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });

export const deleteFromCloudinary = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
};
