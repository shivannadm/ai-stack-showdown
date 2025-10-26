# 🧠 AI Next — Full-Stack AI Chat App (Next.js + OpenAI + MongoDB)

A complete, production-ready scaffold for building AI-powered web apps using **Next.js (App Router)**, **OpenAI**, and **MongoDB**.  
It includes a responsive chat UI, API routes, persistent MongoDB history, streaming AI responses, and full GitHub + Vercel deployment guidance.

---

## 🚀 Features

- ⚡ **Next.js (App Router)** — modern React full-stack framework  
- 🤖 **OpenAI SDK** — use GPT models for text generation  
- 🗄️ **MongoDB / Atlas** — persistent chat history  
- 🔄 **Streaming Support** — real-time token updates  
- ☁️ **1-Click Deploy** on **Vercel**  
- 🧩 **TypeScript** with strict type safety  
- 🔐 **Secure environment configuration**

---

## 📁 Project Structure

```
ai-next/
├─ .env.example
├─ README.md
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ public/
│  └─ favicon.ico
├─ styles/
│  └─ globals.css
├─ lib/
│  ├─ mongodb.ts
│  └─ types.ts
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ globals.css
│  └─ api/
│     ├─ ai/
│     │  └─ route.ts
│     └─ history/
│        └─ route.ts
├─ components/
│  ├─ ChatClient.tsx
│  └─ History.tsx
└─ .github/
   └─ workflows/
      └─ ci.yml
```

---

## 🧰 Local Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/shivannadm/ai-stack-showdown/tree/main/ai-next
cd ai-next
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment file

```bash
cp .env.example .env.local
```

Then open `.env.local` and fill in your real credentials:

```env
OPENAI_API_KEY=sk-REPLACE_WITH_YOURS
MONGODB_URI=mongodb://localhost:27017/aiapp
NEXT_PUBLIC_APP_NAME="AI Next App"
```

> **Note:** For MongoDB Atlas, replace with your connection string from Atlas.

### 4️⃣ Run development server

```bash
npm run dev
# Visit: http://localhost:3000
```

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-abc123...` |
| `MONGODB_URI` | Mongo connection URI | `mongodb://localhost:27017/aiapp` |
| `NEXT_PUBLIC_APP_NAME` | App title shown in UI | `AI Next` |

> ⚠️ `.env.local` is ignored by Git — never commit secrets.

---

## 🔗 GitHub Setup

### Initialize and push code

```bash
git init
git add .
git commit -m "Initial commit — AI Next scaffold"
git branch -M main
git remote add origin https://github.com/shivannadm/ai-stack-showdown/tree/main/ai-next
git push -u origin main
```

---

## ☁️ Vercel Deployment

### Web UI (recommended)

1. Go to [https://vercel.com](https://vercel.com) → Sign in with GitHub.
2. **New Project** → Import Repository → `ai-next`.
3. Framework preset: **Next.js**.
4. Add Environment Variables:
   - `OPENAI_API_KEY`
   - `MONGODB_URI`
   - `NEXT_PUBLIC_APP_NAME` (optional)
5. Click **Deploy** 🚀

> **Important:** Use MongoDB Atlas for production — localhost URIs won't work in the cloud.

### CLI (optional)

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## ⚡ Continuous Integration (GitHub Actions)

`.github/workflows/ci.yml`

```yaml
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
```

This ensures your build succeeds on every push or PR.

---

## 💬 Enabling Streaming Responses (Optional Upgrade)

### Server (`app/api/ai/route.ts`)

```typescript
import { NextRequest } from "next/server";
import { getMongoClient } from "../../../lib/mongodb";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return new Response("No prompt provided", { status: 400 });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    stream: true,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const token = chunk.choices?.[0]?.delta?.content ?? "";
          controller.enqueue(encoder.encode(token));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain" } });
}
```

### Client (`components/ChatClient.tsx`)

```tsx
const res = await fetch("/api/ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
});

if (!res.body) throw new Error("No response body");
const reader = res.body.getReader();
const decoder = new TextDecoder();
let done = false;

while (!done) {
  const { value, done: d } = await reader.read();
  done = d;
  const chunk = decoder.decode(value);
  setAnswer(prev => prev + chunk); // show live text
}
```

---

## 🧾 Useful Commands

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Run locally | `npm run dev` |
| Build for production | `npm run build` |
| Start production server | `npm run start` |
| Lint / typecheck | `npm run lint` |
| Deploy (CLI) | `vercel --prod` |

---

## 🧠 Troubleshooting

| Error | Solution |
|-------|----------|
| `querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net` | Wrong Atlas URI or SRV DNS issue. Use `mongodb://localhost:27017/aiapp` for local dev. |
| No CSS (unstyled page) | Ensure `app/globals.css` exists and imported in `app/layout.tsx`. Restart server. |
| 500 from `/api/ai` | Invalid OpenAI key or exceeded rate limit. |
| "No history yet." | MongoDB connection failed — check `MONGODB_URI`. |
| Vercel build error | Add required env vars in Vercel project settings. |

---

## 🔒 Security & Best Practices

- Keep API keys in `.env.local` (never commit them).
- Restrict MongoDB Atlas IP access or use VPC peering.
- Add request rate limiting to prevent abuse.
- Log token usage and costs for monitoring.
- Use HTTPS on production (Vercel provides it automatically).

---

## 🌟 Next Steps

- Integrate `next-auth` for user authentication.
- Track per-user chat history and OpenAI token costs.
- Add a dashboard using PowerBI / Chart.js for insights.
- Deploy custom domain via Vercel.
- Add more models (Vision, Embeddings, Agents).

---

## 🧩 GitHub + Vercel Quick Commands

```bash
# one-time setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/shivannadm/ai-stack-showdown/tree/main/ai-next
git push -u origin main

# vercel deploy
npm i -g vercel
vercel login
vercel --prod
```

---

## 🧠 Author

**Shivanna DM**  
🎓 Project — AI Engineering  
💬 Focus: GenAI, Full-Stack Development, Automation  
🌐 GitHub: [github.com/&lt;your-username&gt;](https://github.com/shivannadm)

---

## 📜 License

MIT — free for personal & educational use.  
Attribution appreciated ❤️

---

## 🧩 Credits

- [Next.js](https://nextjs.org/) — React Framework
- [OpenAI Node SDK](https://github.com/openai/openai-node)
- [MongoDB](https://www.mongodb.com/)
- [Vercel](https://vercel.com/) — Hosting & CI/CD

---

## 📸 Preview

```
Prompt → OpenAI → MongoDB (history)
```
<img width="1157" height="1079" alt="ai_next_stack" src="https://github.com/user-attachments/assets/d54807c5-a2e9-4980-a505-4e158e646837" />


---

## ✅ Summary

You now have a complete AI web app — with local + cloud deployment, secure configuration, and modular extensibility.  
Perfect for final-year projects, AI demos, and professional portfolios.

💡 **"Think it. Build it. Deploy it."**  
This stack proves how fast AI products can go from idea → prototype → production.

⭐ **Star this repo if you found it helpful!**  
Happy building! 🚀
