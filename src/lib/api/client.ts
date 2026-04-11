// ✅ FIXED: Added ADMIN_API_BASE to the import list here
import { baseUrl, API_BASE, ADMIN_API_BASE } from "./config";

/**
 * 🛡️ Internal Base Fetcher with Timeout Logic
 * Handles slow internet by aborting requests after 15 seconds.
 */
async function baseFetch<T>(
  fullUrl: string,
  options?: RequestInit,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s Timeout

  try {
    const res = await fetch(fullUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    let json: any;
    try {
      json = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      throw new Error(json?.message || "API request failed");
    }

    return json?.data ?? json;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Connection timed out. Please check your internet.");
    }
    throw err;
  }
}

// ✅ Standard User Fetch Wrapper
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  return baseFetch<T>(`${baseUrl}${API_BASE}${endpoint}`, options);
}

// ✅ Admin Fetch Wrapper
export async function adminApiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  return baseFetch<T>(`${baseUrl}${ADMIN_API_BASE}${endpoint}`, options);
}
