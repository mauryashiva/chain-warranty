export async function getWarranties() {
  // Use the env variable, or fallback to an empty string for relative paths
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const res = await fetch(`${baseUrl}/api/warranty`, {
    cache: "no-store", // Ensures fresh data on dashboard
  });

  if (!res.ok) {
    throw new Error("Failed to fetch warranties");
  }

  const json = await res.json();
  return json.data ?? json;
}
