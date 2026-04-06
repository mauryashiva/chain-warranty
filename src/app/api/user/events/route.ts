// src/app/api/user/events/route.ts

import { createSSEStream } from "@/server/events/sse";

export async function GET() {
  try {
    // 1. Await the response from your SSE service
    const sseResponse = await createSSEStream();

    // 2. Pass the extracted `.body` (which is a ReadableStream) instead of the whole Response
    return new Response(sseResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("SSE Stream Error:", error);

    return new Response("Failed to establish SSE connection", {
      status: 500,
    });
  }
}
