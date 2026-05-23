import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = resolve(".");
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 3000);

loadEnv(join(root, ".env.local"));

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
]);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "POST" && url.pathname === "/api/chat") {
      await handleChat(req, res);
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    const filePath = resolve(publicDir, url.pathname === "/" ? "index.html" : `.${url.pathname}`);
    if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    const contentType = mimeTypes.get(extname(filePath)) || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    if (req.method === "GET") {
      res.end(await readFile(filePath));
    } else {
      res.end();
    }
  } catch (error) {
    sendJson(res, 500, { error: error instanceof Error ? error.message : "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Demo is running at http://localhost:${port}`);
});

async function handleChat(req, res) {
  const bodyText = await readBody(req);
  const body = JSON.parse(bodyText || "{}");

  if (!Array.isArray(body.messages)) {
    sendJson(res, 400, { error: "Invalid payload: messages is required." });
    return;
  }

  const baseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com").replace(/\/$/, "");
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const thinking = process.env.OPENAI_THINKING;

  if (!apiKey) {
    sendJson(res, 500, { error: "Missing env: OPENAI_API_KEY" });
    return;
  }

  const requestBody = {
    model,
    stream: true,
    messages: [
      {
        role: "system",
        content: "你是一个电子小狗，是用户的电子宠物，名字叫球球。你去过很多地方，喜欢健身游泳唱歌。请优先用简洁自然的中文回答。",
      },
      ...body.messages,
    ],
  };

  if (thinking) {
    requestBody.thinking = { type: thinking };
  }

  const upstream = await fetch(getChatCompletionsUrl(baseUrl), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!upstream.ok || !upstream.body) {
    const details = await upstream.text().catch(() => "");
    sendJson(res, 502, { error: "Upstream error", status: upstream.status, details });
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
  });

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
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
          res.end();
          return;
        }

        try {
          const json = JSON.parse(data);
          const delta = json?.choices?.[0]?.delta?.content;
          if (delta) res.write(delta);
        } catch {
          // Skip malformed server-sent event chunks.
        }
      }
    }
  } finally {
    reader.releaseLock();
    res.end();
  }
}

function readBody(req) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        req.destroy();
        rejectBody(new Error("Request body is too large."));
      }
    });
    req.on("end", () => resolveBody(body));
    req.on("error", rejectBody);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function loadEnv(filePath) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function getChatCompletionsUrl(baseUrl) {
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
