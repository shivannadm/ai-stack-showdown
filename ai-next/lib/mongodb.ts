import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

let clientPromise: Promise<MongoClient>;

if (!uri || uri.includes("localhost")) {
  // Mock MongoDB for build/development without real DB
  console.warn("⚠️ MONGODB_URI not configured or using localhost - using mock");
  
  // Create a mock that won't crash the build
  clientPromise = new Promise((resolve) => {
    const mockClient = {
      db: () => ({
        collection: () => ({
          find: () => ({ toArray: async () => [] }),
          insertOne: async () => ({ insertedId: "mock" }),
        }),
      }),
    } as any;
    resolve(mockClient);
  });
} else {
  // Real MongoDB connection
  const client = new MongoClient(uri);
  
  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    clientPromise = client.connect();
  }
}

export async function getMongoClient() {
  return clientPromise;
}
