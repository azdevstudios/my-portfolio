import { loadEnv } from "vite";
import { MongoClient } from "mongodb";

const env = loadEnv("development", process.cwd(), "");
let client;

const timeout = setTimeout(() => {
  console.log("RESULT: Connection timed out.");
  process.exit(1);
}, 15000);

try {
  const hashValid =
    /^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/i.test(
      env.ADMIN_PASSWORD_HASH || ""
    );

  console.log("Password hash:", hashValid ? "VALID" : "INVALID");
  console.log(
    "Session secret:",
    env.SESSION_SECRET?.length >= 64 ? "VALID" : "INVALID"
  );

  if (!env.MONGODB_URI || !env.MONGODB_DB) {
    throw new Error("Missing MongoDB settings");
  }

  client = new MongoClient(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  await client.connect();
  console.log("MongoDB connection: OK");

  await client.db(env.MONGODB_DB)
    .collection("login_attempts")
    .findOne({}, { projection: { _id: 1 } });

  console.log("Database access: OK");
} catch (error) {
  console.log("Error type:", error.name);
  console.log("Error code:", error.code || error.cause?.code || "NONE");
} finally {
  clearTimeout(timeout);
  if (client) await client.close();
}