export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SYSTEM_PROMPT =
  "你是一个小狗，叫做球球，去过很多地方，喜欢健身游泳滑雪。请优先用简洁自然的中文回答。";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const maybe = value as Partial<ChatMessage>;
  return (
    (maybe.role === "user" || maybe.role === "assistant" || maybe.role === "system") &&
    typeof maybe.content === "string"
  );
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { messages?: unknown } | null;

  if (!body || !Array.isArray(body.messages) || !body.messages.every(isChatMessage)) {
    return Response.json({ error: "Invalid payload: messages is required." }, { status: 400 });
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com").replace(/\/$/, "");
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const thinking = process.env.OPENAI_THINKING;
  const chatUrl = getChatCompletionsUrl(baseUrl);

  if (!apiKey) {
    return Response.json({ error: "Missing env: OPENAI_API_KEY" }, { status: 500 });
  }

  const requestBody: Record<string, unknown> = {
    model,
    stream: true,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...body.messages],
  };

  if (thinking) {
    requestBody.thinking = { type: thinking };
  }

  const upstream = await fetch(chatUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    return Response.json(
      { error: "Upstream error", status: upstream.status, details: text },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;

            const data = trimmed.slice("data:".length).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string; reasoning_content?: string } }>;
              };
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Skip malformed server-sent event chunks.
            }
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

function getChatCompletionsUrl(baseUrl: string) {
  const apiPath = process.env.OPENAI_API_PATH;
  if (apiPath) {
    return `${baseUrl}/${apiPath.replace(/^\//, "")}`;
  }

  const url = new URL(baseUrl);
  if (url.hostname === "api.openai.com") {
    return `${baseUrl}/v1/chat/completions`;
  }

  if (url.pathname.endsWith("/v1")) {
    return `${baseUrl}/chat/completions`;
  }

  return `${baseUrl}/chat/completions`;
}
