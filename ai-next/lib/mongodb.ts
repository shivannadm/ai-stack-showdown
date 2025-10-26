// lib/mongodb.ts
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to environment variables");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getMongoClient() {
  return clientPromise;
}
```

## ✅ Final Steps:

1. **Update the files** above
2. **Make sure your `.env.local` has:**
```
   OPENAI_API_KEY=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
   MONGODB_URI=mongodb://localhost:27017/aiapp

