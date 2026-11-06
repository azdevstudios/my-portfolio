const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function prepareProjectImage(file) {
  if (!SUPPORTED_TYPES.includes(file.type) || file.size > MAX_SOURCE_BYTES) {
    throw new Error("Choose a PNG, JPG or WebP image under 10 MB.");
  }

  let optimized = file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
    canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image conversion unavailable");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85),
    );
    if (blob?.type === "image/webp" && blob.size < file.size) optimized = blob;
  } catch {
    // Browsers without image conversion can still upload a small original.
  } finally {
    bitmap?.close();
  }

  if (optimized.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      "This image is still over 2 MB after compression. Choose a smaller image.",
    );
  }

  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Unable to read this image."));
    reader.readAsDataURL(optimized);
  });

  return { contentType: optimized.type, data };
}
