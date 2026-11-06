import defaults from "../src/data/profile.js";
import { getDatabase } from "../server/db.js";
import {
  requireAdminWrite,
  readBody,
  RequestError,
  text,
  webUrl,
  sendError,
} from "../server/http.js";

const sections = {
  profile: {
    name: 120,
    role: 120,
    location: 160,
    heroTitle: 160,
    heroAccent: 160,
    description: 1000,
    biography: 6000,
  },
  settings: { whatsapp: 20, github: 2000, linkedin: 2000, instagram: 2000 },
};

function publicProfile(document) {
  return Object.fromEntries(
    Object.keys(defaults).map((key) => [key, document?.[key] ?? defaults[key]]),
  );
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (!["GET", "PUT"].includes(request.method)) {
    response.setHeader("Allow", "GET, PUT");
    return response.status(405).json({ message: "Method not allowed." });
  }
  try {
    if (request.method === "PUT") await requireAdminWrite(request);
    const database = await getDatabase();
    const collection = database.collection("portfolio");
    if (request.method === "GET")
      return response
        .status(200)
        .json({
          profile: publicProfile(await collection.findOne({ _id: "profile" })),
        });
    const { section, values } = readBody(request);
    if (
      !Object.hasOwn(sections, section) ||
      !values ||
      typeof values !== "object" ||
      Array.isArray(values)
    )
      throw new RequestError(400, "Invalid profile section.");
    const validated = {};
    for (const [key, max] of Object.entries(sections[section])) {
      validated[key] =
        section === "settings" && key !== "whatsapp"
          ? webUrl(values[key], key)
          : text(values[key], key, max, section === "profile");
    }
    if (validated.whatsapp && !/^\d{8,15}$/.test(validated.whatsapp))
      throw new RequestError(
        400,
        "Use 8–15 digits for WhatsApp, including the country code, without + or spaces.",
      );
    const document = await collection.findOneAndUpdate(
      { _id: "profile" },
      { $set: { ...validated, updatedAt: new Date() } },
      { upsert: true, returnDocument: "after", includeResultMetadata: false },
    );
    return response
      .status(200)
      .json({ profile: publicProfile(document), message: "Changes saved." });
  } catch (error) {
    return sendError(response, error, "PROFILE_ERROR");
  }
}
