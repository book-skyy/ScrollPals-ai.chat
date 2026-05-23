const list = document.querySelector("#chat-list");
const input = document.querySelector("#chat-input");
const send = document.querySelector("#chat-send");
const messages = [{ role: "assistant", content: "你好，我在这里。直接输入问题就可以开始聊天。" }];

let sending = false;

send.addEventListener("click", onSend);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    onSend();
  }
});

async function onSend() {
  const text = input.value.trim();
  if (!text || sending) return;

  sending = true;
  input.value = "";
  updateControls();

  messages.push({ role: "user", content: text });
  addMessage("user", text);
  const assistantBubble = addMessage("assistant", "思考中...");

  try {
    const payloadMessages = messages.filter((message) => message.role !== "assistant" || message.content);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: payloadMessages }),
    });

    if (!response.ok || !response.body) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `请求失败：${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      content += decoder.decode(value, { stream: true });
      assistantBubble.textContent = content || "思考中...";
      scrollToBottom();
    }

    messages.push({ role: "assistant", content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    assistantBubble.textContent = `出错了：${message}`;
  } finally {
    sending = false;
    updateControls();
    input.focus();
  }
}

function addMessage(role, content) {
  const row = document.createElement("div");
  row.className = `chat-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = content;

  row.appendChild(bubble);
  list.appendChild(row);
  scrollToBottom();
  return bubble;
}

function updateControls() {
  send.disabled = sending || !input.value.trim();
  send.textContent = sending ? "发送中" : "发送";
  input.disabled = sending;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  });
}

input.addEventListener("input", updateControls);
updateControls();
