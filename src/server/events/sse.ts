type Client = {
  id: string;
  controller: ReadableStreamDefaultController;
};

const clients: Client[] = [];

export function createSSEStream() {
  const stream = new ReadableStream({
    start(controller) {
      const clientId = crypto.randomUUID();

      const client: Client = {
        id: clientId,
        controller,
      };

      clients.push(client);

      // Send initial message
      controller.enqueue(`data: ${JSON.stringify({ type: "CONNECTED" })}\n\n`);

      // Cleanup on close
      return () => {
        const index = clients.findIndex((c) => c.id === clientId);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

// 🔥 Broadcast event to all clients
export function sendEvent(data: any) {
  for (const client of clients) {
    client.controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
  }
}
