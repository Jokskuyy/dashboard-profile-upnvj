import { supabase } from "../../lib/supabase";

const BUCKET_NAME = "facility-photos";

/**
 * Upload foto fasilitas ke Supabase Storage
 * @param file - File gambar yang akan di-upload
 * @returns Public URL dari file yang di-upload
 */
export const uploadFacilityPhoto = async (file: File): Promise<string> => {
  // Generate unique filename: timestamp + sanitized original name
  const timestamp = Date.now();
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .toLowerCase();
  const filePath = `facilities/${timestamp}_${sanitizedName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal upload foto: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Validasi file gambar sebelum upload
 * @param file - File yang akan divalidasi
 * @returns Object dengan status valid dan pesan error jika ada
 */
export const validateImageFile = (
  file: File,
): { valid: boolean; error?: string } => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.",
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "Ukuran file terlalu besar. Maksimal 5MB.",
    };
  }

  return { valid: true };
};
