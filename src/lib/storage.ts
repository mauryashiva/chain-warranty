import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadToCloud(
  file: File,
  walletAddress: string,
  subFolder: "assets" | "documents",
): Promise<string> {
  try {
    const timestamp = Date.now();
    // Path: 0x123.../assets/1712214400-filename.jpg
    const filePath = `${walletAddress}/${subFolder}/${timestamp}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("chain-warranty")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("chain-warranty")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error("Storage Upload Error:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }
}
