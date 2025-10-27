import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI || "";

const options: MongoClientOptions = {
  tls: true,
  tlsAllowInvalidCertificates: false,
};

let clientPromise: Promise<MongoClient>;

if (!uri || uri.includes("localhost")) {
  console.warn("⚠️ MONGODB_URI not configured properly");
  
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
  const client = new MongoClient(uri, options);
  
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
