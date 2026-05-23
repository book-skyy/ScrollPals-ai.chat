# AI Chat Demo

一个基于 Next.js App Router 的流式聊天 demo，后端使用 OpenAI 兼容的 Chat Completions 接口。

## 环境变量

复制 `.env.example` 为 `.env.local`，然后填入自己的 API Key：

```bash
OPENAI_BASE_URL=https://api.deepseek.com
OPENAI_API_PATH=/chat/completions
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=deepseek-v4-flash
OPENAI_THINKING=disabled
```

## 本地运行

当前目录也提供了一个零依赖运行器，不需要先执行 `npm install`：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-demo.ps1
```

然后打开 http://localhost:3000。

如果你的电脑已经安装了 Node.js/npm，也可以使用 Next.js 方式运行：

```bash
npm install
npm run dev
```

然后打开 http://localhost:3000。
