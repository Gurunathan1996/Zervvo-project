import { Request, Response } from 'express';
import * as uploadService from '../services/uploadService';
import path from 'path'; 
import { promises as fs } from 'fs';
import { ApplicationError } from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

/**
 * Controller function to handle file uploads after Multer has processed them.
 * It delegates the image processing and storage logic to the uploadService.
 * @param req The Express request object, containing req.file after Multer.
 * @param res The Express response object.
 */
export const handleFileUpload = async (req: Request, res: Response): Promise<void> => {
  try {

    if (!req.file) {
      throw new ApplicationError('No file uploaded.', 400, 'NO_FILE_UPLOADED');
    }

    const processedImagePath = await uploadService.processAndStoreImage(
      req.file.path,
      req.file.filename,
      UPLOAD_DIR
    );

    res.status(200).json({
      message: 'File uploaded and processed successfully',
      filename: path.basename(processedImagePath),
      filepath: processedImagePath
    });
  } catch (error: any) {
    try {
      if (req.file) { 
        await fs.unlink(req.file.path);
      }
    } catch (unlinkError: any) {
      console.error('Error deleting raw file after processing failure:', unlinkError.message);
    }

    if (error instanceof ApplicationError) {
      res.status(error.httpCode).json({
        message: error.message,
        code: error.code,
        details: error.details,
      });
    } else {
      const unhandledError = new UnhandledException(error);
      res.status(unhandledError.httpCode).json({
        message: unhandledError.message,
        code: unhandledError.code,
        details: unhandledError.details,
      });
    }
  }
};
