import { getSession } from "./auth.js";

export class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function requireAdminWrite(request) {
  if (request.headers["sec-fetch-site"] === "cross-site")
    throw new RequestError(403, "Request not allowed.");
  try {
    const origin = new URL(request.headers.origin);
    if (
      !["http:", "https:"].includes(origin.protocol) ||
      origin.host !== request.headers.host
    )
      throw new Error("Origin mismatch");
  } catch {
    throw new RequestError(
      403,
      "Request not allowed. Refresh the page and try again.",
    );
  }
  if (
    !(request.headers["content-type"] || "")
      .toLowerCase()
      .startsWith("application/json")
  )
    throw new RequestError(415, "A JSON request is required.");
  if (!(await getSession(request)))
    throw new RequestError(
      401,
      "Your session has expired. Please sign in again.",
    );
}

export function readBody(request) {
  const body = request.body;
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new RequestError(400, "Invalid request body.");
  if (Buffer.byteLength(JSON.stringify(body)) > 32768)
    throw new RequestError(413, "The submitted content is too large.");
  return body;
}

export function text(value, label, max, required = false) {
  if (value === undefined && !required) return "";
  if (typeof value !== "string")
    throw new RequestError(400, `${label} must be text.`);
  const result = value.trim();
  if (result.length > max || (required && !result))
    throw new RequestError(
      400,
      `${label} ${!result ? "is required" : `must be ${max} characters or fewer`}.`,
    );
  return result;
}

export function webUrl(value, label, image = false) {
  const result = text(value, label, 2000);
  if (!result) return "";
  if (image && /^\/(?!\/)/.test(result) && !/[\\\s]/.test(result))
    return result;
  try {
    const url = new URL(result);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      throw new Error("Invalid URL");
    return result;
  } catch {
    throw new RequestError(
      400,
      `${label} must be a valid HTTP or HTTPS URL${image ? " or a local /image path" : ""}.`,
    );
  }
}

export function sendError(response, error, label) {
  if (error instanceof RequestError)
    return response.status(error.status).json({ message: error.message });
  console.error(label, { type: error.name, code: error.code || "NONE" });
  return response
    .status(500)
    .json({ message: "Unable to complete your request. Please try again." });
}
