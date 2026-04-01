import { randomBytes } from "crypto";

export async function GET() {
  const nonce = randomBytes(16).toString("hex");

  return Response.json({ nonce });
}
