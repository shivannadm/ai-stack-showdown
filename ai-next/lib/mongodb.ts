// lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

const uri = process.env.MONGODB_URI;
let cachedClient: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
    if (cachedClient) return cachedClient;
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
}
