// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMongoClient } from "../../../lib/mongodb";
import { OpenAI } from "openai";

// Ensure this file is treated as a Node.js runtime route
export const runtime = 'nodejs';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = (body?.prompt || "").toString();

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt missing" }, { status: 400 });
    }

    // Call OpenAI Chat Completions API (correct method)
    const aiResp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    });

    // Extract the response text
    const text = aiResp.choices[0]?.message?.content || "";

    // Save to MongoDB
    const mongo = await getMongoClient();
    const db = mongo.db("aiapp");
    const doc = {
      prompt,
      response: text,
      createdAt: new Date(),
    };
    await db.collection("messages").insertOne(doc);

    return NextResponse.json({ text, ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("API /ai error:", err);
    return NextResponse.json(
      { error: err?.message ?? String(err) }, 
      { status: 500 }
    );
  }
}
