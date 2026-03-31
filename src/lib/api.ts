export async function getWarranties() {
  const res = await fetch("http://localhost:3000/api/warranty");

  if (!res.ok) {
    throw new Error("Failed to fetch warranties");
  }

  const json = await res.json();

  // ✅ FIX HERE
  return json.data ?? json;
}
