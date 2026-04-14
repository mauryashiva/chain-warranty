import { createClient } from "@supabase/supabase-js";

// --- INITIALIZATION ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase Environment Variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 🛰️ UPLOAD TO CLOUD (Supabase Storage)
 * Highly resilient utility for handling product assets and claim evidence.
 * * @param file - The raw File object from the input
 * @param walletAddress - The user's wallet (used as root folder for security)
 * @param subFolder - Categorization: 'assets' (products) or 'documents' (claims)
 */
export async function uploadToCloud(
  file: File,
  walletAddress: string,
  subFolder: "assets" | "documents" = "documents",
): Promise<string> {
  try {
    // 1. Clean filename to prevent URL issues (removes special characters)
    const cleanFileName = file.name
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, "_");
    const timestamp = Date.now();

    // 2. Construct Professional Path: wallet/category/timestamp-name.ext
    const filePath = `${walletAddress}/${subFolder}/${timestamp}-${cleanFileName}`;

    // 3. Perform Upload to your 'chain-warranty' bucket
    const { data, error } = await supabase.storage
      .from("chain-warranty")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // Prevents overwriting existing files
      });

    if (error) {
      // Handle specific Supabase error types
      if (error.message.includes("Duplicate")) {
        throw new Error("This file has already been uploaded.");
      }
      throw error;
    }

    // 4. Generate Public URL for Database Storage
    const { data: urlData } = supabase.storage
      .from("chain-warranty")
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error("Failed to generate public URL for the uploaded asset.");
    }

    return urlData.publicUrl;
  } catch (error: any) {
    console.error("Critical Storage Error:", error.message);
    throw new Error(`Cloud Sync Failed: ${error.message}`);
  }
}

/**
 * 🗑️ DELETE FROM CLOUD (Optional helper for cleanup)
 */
export async function deleteFromCloud(filePath: string) {
  const { error } = await supabase.storage
    .from("chain-warranty")
    .remove([filePath]);

  if (error) throw error;
  return true;
}
