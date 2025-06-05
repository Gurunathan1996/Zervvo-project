import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import authenticateToken from '../middlewares/authMiddleware';
import * as uploadController from '../controllers/uploadController';

dotenv.config();

const router = Router();

// Define the upload directory from environment variables or default to './uploads'
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

(async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    // console.log(`Upload directory created or already exists: ${UPLOAD_DIR}`);
  } catch (err: any) {
    console.error('Error creating upload directory:', err.message);
    process.exit(1);
  }
})();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter to accept only images and limit size
const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  },
  fileFilter: (req, file, cb) => {

    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
    }
  }
}).single('image');

/**
 * @route POST /api/upload
 * @desc Upload an image file, validate, process, and store it.
 * @access Private (requires JWT)
 * @middleware authenticateToken, uploadMiddleware (multer middleware)
 */
router.post('/image', 
  authenticateToken, 
  (
    req: Request, 
    res: Response
  ) => {
  uploadMiddleware(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      console.error('Unknown file upload error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    await uploadController.handleFileUpload(req, res);
  });
});

export default router;
