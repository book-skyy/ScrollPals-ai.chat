"use client";

import { useMemo, useRef, useState } from "react";

type Role = "user" | "assistant";
type Message = { role: Role; content: string };

const initialMessages: Message[] = [
  { role: "assistant", content: "你好，我在这里。直接输入问题就可以开始聊天。" },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  async function onSend() {
    const text = input.trim();
    if (!text || sending) return;

    const payloadMessages = [...messages, { role: "user" as const, content: text }];

    setSending(true);
    setInput("");
    setMessages([...payloadMessages, { role: "assistant", content: "" }]);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        throw new Error(errText || `请求失败：${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        assistantText += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") {
            next[next.length - 1] = { ...last, content: assistantText };
          }
          return next;
        });
        scrollToBottom();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        const content = `出错了：${message}`;

        if (last?.role === "assistant" && !last.content) {
          next[next.length - 1] = { ...last, content };
          return next;
        }

        return [...next, { role: "assistant", content }];
      });
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }

  return (
    <main className="chat-page">
      <section className="chat-shell" aria-label="AI 实时聊天">
        <header className="chat-header">
          <div>
            <h1>AI 实时聊天</h1>
            <p>后端使用 OpenAI 兼容接口，支持流式输出。</p>
          </div>
          <span className="status-pill">Online</span>
        </header>

        <div className="chat-list" ref={listRef}>
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-row ${message.role}`}>
              <div className="chat-bubble">
                {message.content || (sending && index === messages.length - 1 ? "思考中..." : "")}
              </div>
            </div>
          ))}
        </div>

        <footer className="chat-inputbar">
          <input
            className="chat-input"
            value={input}
            placeholder="输入内容，按回车发送"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            disabled={sending}
            aria-label="聊天输入"
          />
          <button className="chat-send" onClick={onSend} disabled={!canSend}>
            {sending ? "发送中" : "发送"}
          </button>
        </footer>
      </section>
    </main>
  );
}
