export interface PreparedImage {
  file: File;
  originalSize: number;
  finalSize: number;
  compressed: boolean;
  note?: string;
}

const MAX_DIMENSION = 2200;
const JPEG_QUALITY = 0.82;
const COMPRESSIBLE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function formatBytes(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function getOutputType(file: File) {
  if (file.type === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}

function getOutputName(file: File, outputType: string) {
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
  return `${baseName}.${extension}`;
}

async function loadBitmap(file: File) {
  if ('createImageBitmap' in window) {
    return createImageBitmap(file);
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read image dimensions.'));
      img.src = imageUrl;
    });

    return image;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function getTargetSize(width: number, height: number) {
  const largestSide = Math.max(width, height);
  if (largestSide <= MAX_DIMENSION) {
    return { width, height, resized: false };
  }

  const scale = MAX_DIMENSION / largestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    resized: true,
  };
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not compress image.'));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  if (!COMPRESSIBLE_TYPES.includes(file.type)) {
    return {
      file,
      originalSize: file.size,
      finalSize: file.size,
      compressed: false,
      note: file.type === 'image/gif' ? 'GIF kept original to preserve animation.' : undefined,
    };
  }

  const bitmap = await loadBitmap(file);
  const width = bitmap.width;
  const height = bitmap.height;
  const { width: targetWidth, height: targetHeight, resized } = getTargetSize(width, height);
  const shouldCompress = resized || file.size > 2 * 1024 * 1024;

  if (!shouldCompress) {
    if ('close' in bitmap) bitmap.close();
    return {
      file,
      originalSize: file.size,
      finalSize: file.size,
      compressed: false,
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    if ('close' in bitmap) bitmap.close();
    return {
      file,
      originalSize: file.size,
      finalSize: file.size,
      compressed: false,
      note: 'Compression skipped because the browser could not prepare the image.',
    };
  }

  context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  if ('close' in bitmap) bitmap.close();

  const outputType = getOutputType(file);
  const blob = await canvasToBlob(canvas, outputType, JPEG_QUALITY);

  if (blob.size >= file.size) {
    return {
      file,
      originalSize: file.size,
      finalSize: file.size,
      compressed: false,
      note: 'Compression skipped because the original file was smaller.',
    };
  }

  const preparedFile = new File([blob], getOutputName(file, outputType), {
    type: outputType,
    lastModified: Date.now(),
  });

  return {
    file: preparedFile,
    originalSize: file.size,
    finalSize: preparedFile.size,
    compressed: true,
    note: `Compressed from ${formatBytes(file.size)} to ${formatBytes(preparedFile.size)}.`,
  };
}

export function formatImageSize(bytes: number) {
  return formatBytes(bytes);
}
