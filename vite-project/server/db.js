import { MongoClient } from "mongodb";

let connectionPromise;

export async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB;

  if (!uri || !databaseName) {
    throw new Error("MongoDB environment variables are missing.");
  }

  if (!connectionPromise) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    connectionPromise = client.connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  const client = await connectionPromise;
  return client.db(databaseName);
}