import { PreviewController } from '../controllers/preview.controller';
import upload from '../middlewares/upload.middleware'; // Multer configuration middleware
import { Router } from 'express';

// Initialize the Express router and the controller.
const router = Router();
const previewController = new PreviewController();

// --- TEMPORARY PREVIEW ROUTES ---
// These routes handle temporary file uploads for user previews
// before the data is permanently saved.

/**
 * @route   POST /api/previews/single
 * @desc    Uploads a single file for preview. The 'banner' key is used in the form-data.
 * @access  Protected (Assuming an auth middleware is applied before this router)
 */
router.post(
  '/single',
  upload.single('banner'), // Multer middleware to process one file from the 'banner' field.
  previewController.uploadSinglePreview
);

/**
 * @route   POST /api/previews/multiple
 * @desc    Uploads multiple files (up to 10) for preview. The 'product' key is used.
 * @access  Protected
 */
router.post(
  '/multiple',
  upload.array('product', 10), // Multer middleware for an array of files, max 10, from the 'product' field.
  previewController.uploadMultiplePreviews
);

/**
 * @route   DELETE /api/previews/:filename
 * @desc    Deletes a specific temporary preview file from the server.
 * @access  Protected
 */
router.delete(
  '/:filename',
  previewController.deletePreview
);

export { router as previewRoute };