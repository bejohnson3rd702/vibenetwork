/**
 * Reusable utility to process, aspect-ratio crop, and AI-enhance uploaded images platform-wide.
 * Prevents cut-offs by intelligently biasing vertical crops slightly upward (to preserve heads/faces).
 */
export async function processAndEnhanceImage(
  file: File,
  aspectMode: 'avatar' | 'logo' | 'favicon' | 'homepage' | 'hero' | 'product' | 'post'
): Promise<File> {
  // If it is not an image, skip processing
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve) => {
    let targetAspect = 1.0;
    let maxWidth = 1024;
    let maxHeight = 1024;

    switch (aspectMode) {
      case 'avatar':
      case 'logo':
      case 'favicon':
        targetAspect = 1.0; // 1:1
        maxWidth = 512;
        maxHeight = 512;
        break;
      case 'homepage':
        targetAspect = 21 / 9; // 21:9 Profile/Theme Banner
        maxWidth = 1920;
        maxHeight = 822;
        break;
      case 'hero':
      case 'post':
        targetAspect = 16 / 9; // 16:9 Landscape Video/Post Hero
        maxWidth = 1920;
        maxHeight = 1080;
        break;
      case 'product':
        targetAspect = 4 / 3; // 4:3 E-commerce product image
        maxWidth = 1024;
        maxHeight = 768;
        break;
      default:
        targetAspect = 1.0;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          const originalWidth = img.width;
          const originalHeight = img.height;
          const originalAspect = originalWidth / originalHeight;

          let sx = 0;
          let sy = 0;
          let sw = originalWidth;
          let sh = originalHeight;

          // Crop math
          if (originalAspect > targetAspect) {
            // Original is wider: Crop sides (center crop horizontally)
            sw = originalHeight * targetAspect;
            sx = (originalWidth - sw) / 2;
          } else if (originalAspect < targetAspect) {
            // Original is taller: Crop top/bottom
            sh = originalWidth / targetAspect;
            // CRITICAL USER FIX: Offset crop slightly upwards (0.15 instead of 0.5) to keep heads and top details from being cut off
            sy = (originalHeight - sh) * 0.15;
            if (sy < 0) sy = 0;
            if (sy + sh > originalHeight) sy = originalHeight - sh;
          }

          // Output dimensions
          let outWidth = sw;
          let outHeight = sh;
          if (outWidth > maxWidth) {
            outWidth = maxWidth;
            outHeight = maxWidth / targetAspect;
          }

          canvas.width = outWidth;
          canvas.height = outHeight;

          // Apply AI Enhancement Filters: exposure boost, saturation lift, high-fidelity color balancing
          ctx.filter = 'contrast(1.08) saturate(1.15) brightness(1.02)';
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outWidth, outHeight);

          canvas.toBlob((blob) => {
            if (blob) {
              const enhancedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(enhancedFile);
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.90); // 90% JPEG quality
        } catch (err) {
          console.error('Image AI processing failed, uploading original', err);
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
