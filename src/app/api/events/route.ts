import { createSSEStream } from "@/server/events/sse";

export async function GET() {
  return createSSEStream();
}
