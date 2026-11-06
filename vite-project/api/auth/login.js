import { createHash } from "node:crypto";
import { getDatabase } from "../../server/db.js";
import {
  verifyCredentials,
  createSession,
  sessionCookie,
} from "../../server/auth.js";

const WINDOW_SECONDS = 900;
const MAX_ATTEMPTS = 10;

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      message: "Method not allowed.",
    });
  }

  if (request.headers.origin) {
    try {
      if (new URL(request.headers.origin).host !== request.headers.host) {
        return response.status(403).json({
          message: "Request not allowed.",
        });
      }
    } catch {
      return response.status(403).json({
        message: "Request not allowed.",
      });
    }
  }

  const contentType = request.headers["content-type"] || "";

  if (!contentType.toLowerCase().startsWith("application/json")) {
    return response.status(415).json({
      message: "Send a JSON request.",
    });
  }

  const { email, password } = request.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 254 ||
    password.length > 1024
  ) {
    return response.status(400).json({
      message: "Enter a valid email and password.",
    });
  }

  let stage = "configuration";

  try {
    const required = [
      "MONGODB_URI",
      "MONGODB_DB",
      "ADMIN_EMAIL",
      "ADMIN_PASSWORD_HASH",
      "SESSION_SECRET",
    ];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length) {
      console.error("MISSING_SETTINGS:", missing.join(", "));
      throw new Error("Missing settings");
    }

    stage = "database connection";
    const database = await getDatabase();

    stage = "login attempt counter";
    const windowId = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
    const accountKey = createHash("sha256")
      .update(process.env.ADMIN_EMAIL.trim().toLowerCase())
      .digest("hex");

    const attempts = await database
      .collection("login_attempts")
      .findOneAndUpdate(
        { _id: `${accountKey}:${windowId}` },
        {
          $inc: { count: 1 },
          $setOnInsert: { createdAt: new Date() },
        },
        {
          upsert: true,
          returnDocument: "after",
          includeResultMetadata: false,
        },
      );

    if (!attempts) {
      throw new Error("Counter unavailable");
    }

    if (attempts.count > MAX_ATTEMPTS) {
      const retryAfter =
        WINDOW_SECONDS - (Math.floor(Date.now() / 1000) % WINDOW_SECONDS);

      response.setHeader("Retry-After", String(retryAfter));

      return response.status(429).json({
        message: "Too many login attempts. Please try again later.",
      });
    }

    stage = "password verification";

    if (!verifyCredentials(email, password)) {
      return response.status(401).json({
        message: "Email or password is incorrect.",
      });
    }

    stage = "session creation";
    const token = await createSession();

    stage = "cookie creation";
    response.setHeader("Set-Cookie", sessionCookie(token));

    return response.status(200).json({
      message: "Login successful.",
    });
  } catch (error) {
    console.error("LOGIN_ERROR", {
      stage,
      type: error.name,
      code: error.code || error.cause?.code || "NONE",
    });

    return response.status(500).json({
      message: "Unable to log in. Please try again later.",
    });
  }
}
