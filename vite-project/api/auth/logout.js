import { sessionCookie } from "../../server/auth.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      message: "Method not allowed.",
    });
  }

  const origin = request.headers.origin;

  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.host) {
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

  response.setHeader("Set-Cookie", sessionCookie("", true));

  return response.status(200).json({
    message: "Logged out successfully.",
  });
}
