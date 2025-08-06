import cloudinary from "@/config/cloudinary";
import { logger } from "@/config/logger";
import { BadRequestException } from "@/exceptions/app-error";
import { UploadApiResponse } from "cloudinary";

export class UploadService {
  uploadSingleImage = async (image: Express.Multer.File, folder: string): Promise<{ publicId: string, imageUrl: string}> => {
    const uploadImage: UploadApiResponse = await cloudinary.uploader.upload(image.path, {
      folder: `collecto/${folder}`,
      transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto' }],
      resource_type: 'image',
    })

    return {
      publicId: uploadImage.public_id,
      imageUrl: uploadImage.secure_url
    }
  }

  uploadMultipleImage = async (images: Express.Multer.File[], folder: string) => {
    const uploadTasks = images.map(image => this.uploadSingleImage(image, folder));
    const results = await Promise.all(uploadTasks);

    return results;
  }

  deleteImage = async (publicId: string): Promise<boolean> => {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image'
      });
      logger.info(`Delete image with publicId: ${publicId} in cloudinary successfully.`);
      return true;
    } catch (error) {
      logger.error(`Failed to delete image with publicId: ${publicId}`);
      return false;
    }
  }
}