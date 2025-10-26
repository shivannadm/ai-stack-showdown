// app/api/ai/route.ts
import { NextRequest } from "next/server";
// relative path from app/api/ai/route.ts to lib/mongodb.ts
import { getMongoClient } from "../../../lib/mongodb";
import { OpenAI } from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = (body?.prompt || "").toString();

    if (!prompt || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Prompt missing" }), { status: 400 });
    }

    // Call the OpenAI Responses endpoint (simple non-streaming example)
    const aiResp = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    // Extract text — depends on API shape; this is conservative
    const outputItems = aiResp.output ?? [];
    const text = Array.isArray(outputItems)
      ? outputItems
          .map((o: any) => (o?.content ?? []).map((c: any) => c.text ?? "").join(""))
          .join("")
      : (aiResp.output_text ?? "");

    // Save to MongoDB
    const mongo = await getMongoClient();
    const db = mongo.db("aiapp");
    const doc = {
      prompt,
      response: text,
      createdAt: new Date(),
    };
    await db.collection("messages").insertOne(doc);

    return new Response(JSON.stringify({ text, ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("API /ai error:", err);
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
