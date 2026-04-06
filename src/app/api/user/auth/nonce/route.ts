import { randomBytes } from "crypto";

export async function GET() {
  try {
    const nonce = randomBytes(16).toString("hex");

    return Response.json({ nonce });
  } catch (error) {
    console.error("Nonce generation error:", error);

    return Response.json(
      { message: "Failed to generate nonce" },
      { status: 500 },
    );
  }
}
