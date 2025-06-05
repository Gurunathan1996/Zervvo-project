import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

/**
 * Processes an image: resizes and compresses it.
 */
const processImage = async (
  inputPath: string,
  filename: string,
  outputDir: string,
  width: number = 800,
  quality: number = 80
): Promise<string> => {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    const uniqueFilename = `${Date.now()}-${filename}`;
    const outputPath = path.join(outputDir, uniqueFilename);

    await sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true 
      })
      .jpeg({ quality: quality, progressive: true })
      .toFile(outputPath);

    console.log(`Image processed and saved to: ${outputPath}`);
    return outputPath;
  } catch (error: any) {
    console.error('Error processing image:', error.message);
    throw new Error('Image processing failed.');
  }
};

export default processImage;
