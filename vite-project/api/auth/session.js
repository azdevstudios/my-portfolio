import { getSession } from "../../server/auth.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      message: "Method not allowed.",
    });
  }

  try {
    const session = await getSession(request);

    if (!session) {
      return response.status(401).json({
        authenticated: false,
        message: "Please log in.",
      });
    }

    return response.status(200).json({
      authenticated: true,
      user: {
        role: "admin",
      },
    });
  } catch {
    console.error("Session check failed. Check server configuration.");

    return response.status(500).json({
      authenticated: false,
      message: "Unable to verify your session.",
    });
  }
}
