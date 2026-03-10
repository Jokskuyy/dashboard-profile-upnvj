import { supabase } from "../../lib/supabase";

const BUCKET_NAME = "facility-photos";

/**
 * Upload a facility photo to Supabase Storage.
 * Returns the public URL of the uploaded file.
 *
 * Prerequisites:
 * - Create a bucket named "facility-photos" in Supabase Dashboard → Storage
 * - Set bucket to public (or add appropriate RLS policies for public upload/read)
 */
export const uploadFacilityPhoto = async (file: File): Promise<string> => {
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Format file tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.",
    );
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Ukuran file terlalu besar. Maksimal 5MB.");
  }

  // Generate unique filename
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[^a-zA-Z0-9_-]/g, "_") // sanitize
    .substring(0, 50); // limit length
  const fileName = `facilities/${Date.now()}-${sanitizedName}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    throw new Error("Gagal mengupload foto. Silakan coba lagi.");
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

  return publicUrl;
};
