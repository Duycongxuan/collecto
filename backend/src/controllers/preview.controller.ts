import { logger } from "../config/logger";
import { ICustomRequest } from "../interfaces/request.interface";
import { Response, NextFunction } from 'express';
import { ResponseUtil } from "../utils/response.util";
import { AppError } from "../utils/app-error";
import fs from 'fs/promises'; // Use the promise-based version for non-blocking I/O
import path from 'path';

// It's best practice to define the directory path as a constant.
const TEMP_UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

/**
 * Handles temporary file uploads for preview purposes.
 * Files uploaded via this controller are considered temporary and
 * should be moved to permanent storage (e.g., cloud) or cleaned up later.
 */
export class PreviewController {

  /**
   * Handles a single temporary file upload for preview.
   * Returns the filename and a temporary URL to view the image.
   */
  uploadSinglePreview = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
        throw new AppError('No file was uploaded for preview.', 400);
      }

      const responsePayload = {
        filename: file.filename, // The crucial piece of information for the final save step
        previewUrl: this.buildPreviewUrl(req, file.filename),
      };

      logger.info(`Generated single preview for: ${file.filename}`);
      // Respond with the data the client needs to show the preview and later save it.
      ResponseUtil.success(res, responsePayload, 'Preview created successfully.', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles multiple temporary file uploads for preview.
   * Returns a list of filenames and their temporary preview URLs.
   */
  uploadMultiplePreviews = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        throw new AppError('No files were uploaded for preview.', 400);
      }

      const previews = files.map(file => ({
        filename: file.filename,
        previewUrl: this.buildPreviewUrl(req, file.filename),
      }));

      logger.info(`Generated ${files.length} previews.`);
      ResponseUtil.success(res, previews, 'Previews created successfully.', 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes a temporary preview image.
   * This is used when a user removes a previewed image before saving.
   */
  deletePreview = async (req: ICustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { filename } = req.params;

      // **SECURITY:** Sanitize filename to prevent Path Traversal attacks.
      // This ensures an attacker can't delete files outside the intended directory.
      if (!filename || filename.includes('..') || path.isAbsolute(filename)) {
          throw new AppError('Invalid filename.', 400);
      }

      const filePath = path.join(TEMP_UPLOADS_DIR, filename);

      // Use async `unlink` to avoid blocking the server.
      await fs.unlink(filePath);
      
      logger.info(`Successfully deleted preview: ${filename}`);
      ResponseUtil.success(res, null, `Preview '${filename}' deleted.`, 200);
    } catch (error: any) {
      // Provide a specific error if the file doesn't exist (e.g., double-delete).
      if (error.code === 'ENOENT') {
        return next(new AppError(`Preview not found: ${req.params.filename}`, 404));
      }
      // Forward other errors (like permissions) to the global error handler.
      next(error);
    }
  };

  /**
   * Helper function to build a full public URL for a given preview filename.
   */
  private buildPreviewUrl(req: ICustomRequest, filename: string): string {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    // Assumes an '/uploads' static route is configured in your main Express app.
    return `${baseUrl}/uploads/${filename}`;
  }
}