export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Processes an image file: crops it, resizes it to a max-width, and converts it to WebP.
 */
export async function processProductImage(
  imageFile: File,
  crop: CropArea,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate final dimensions
        let finalWidth = crop.width;
        let finalHeight = crop.height;

        if (finalWidth > maxWidth) {
          const ratio = maxWidth / finalWidth;
          finalWidth = maxWidth;
          finalHeight = finalHeight * ratio;
        }

        canvas.width = finalWidth;
        canvas.height = finalHeight;

        // Draw cropped and resized image
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          finalWidth,
          finalHeight
        );

        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
