// app/api/history/route.ts
import { NextRequest } from "next/server";
import { getMongoClient } from "../../../lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const mongo = await getMongoClient();
    const db = mongo.db("aiapp");
    const rows = await db
      .collection("messages")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // serialize dates to ISO before returning
    const out = rows.map((r: any) => ({
      _id: r._id?.toString?.() ?? String(r._id),
      prompt: r.prompt,
      response: r.response,
      createdAt: r.createdAt,
    }));

    return new Response(JSON.stringify(out), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("history error", err);
    return new Response(JSON.stringify({ error: err?.message ?? "unknown" }), { status: 500 });
  }
}
