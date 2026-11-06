import { loadEnv } from "vite";
import { MongoClient } from "mongodb";
import { projects } from "../src/data/projects.js";

const env = loadEnv("development", process.cwd(), "");
let client;

try {
  if (!env.MONGODB_URI || !env.MONGODB_DB) {
    throw new Error("MongoDB settings are missing.");
  }

  client = new MongoClient(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();

  const collection = client
    .db(env.MONGODB_DB)
    .collection("projects");

  if (projects.length === 0) {
    console.log("No projects to import.");
  } else {
    const operations = projects.map(({ id, ...project }) => ({
      updateOne: {
        filter: { _id: id },
        update: {
          $setOnInsert: {
            ...project,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(operations);

    console.log(`Added ${result.upsertedCount} projects.`);
    console.log("Existing projects were preserved.");
  }
} catch (error) {
  console.error("Project import failed:", {
    type: error.name,
    code: error.code || "NONE",
  });

  process.exitCode = 1;
} finally {
  if (client) await client.close();
}