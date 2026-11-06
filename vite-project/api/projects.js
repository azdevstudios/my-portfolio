import { randomUUID } from "node:crypto";
import { getDatabase } from "../server/db.js";
import {
  requireAdminWrite,
  readBody,
  RequestError,
  sendError,
} from "../server/http.js";
import { validateProject, publicProject } from "../server/projects.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST, PUT, DELETE, PATCH");
    return response.status(405).json({ message: "Method not allowed." });
  }
  try {
    if (request.method !== "GET") await requireAdminWrite(request);
    const database = await getDatabase();
    const collection = database.collection("projects");
    if (request.method === "GET") {
      const documents = await collection
        .find({ archivedAt: { $exists: false } })
        .sort({ createdAt: 1, _id: 1 })
        .toArray();
      return response
        .status(200)
        .json({ projects: documents.map(publicProject) });
    }
    const body = readBody(request);
    if (request.method === "POST") {
      const values = validateProject(body);
      const document = {
        _id: randomUUID(),
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await collection.insertOne(document);
      return response
        .status(201)
        .json({ project: publicProject(document), message: "Project added." });
    }
    const id = request.query?.id;
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id))
      throw new RequestError(400, "A valid project ID is required.");
    if (request.method === "PUT") {
      const values = validateProject(body);
      const document = await collection.findOneAndUpdate(
        { _id: id, archivedAt: { $exists: false } },
        { $set: { ...values, updatedAt: new Date() } },
        { returnDocument: "after", includeResultMetadata: false },
      );
      if (!document)
        throw new RequestError(
          404,
          "Project not found. Refresh your collection.",
        );
      return response
        .status(200)
        .json({
          project: publicProject(document),
          message: "Project updated.",
        });
    }
    const restoring = request.method === "PATCH";
    const result = await collection.updateOne(
      { _id: id, archivedAt: { $exists: restoring } },
      restoring
        ? { $unset: { archivedAt: "" }, $set: { updatedAt: new Date() } }
        : { $set: { archivedAt: new Date(), updatedAt: new Date() } },
    );
    if (!result.matchedCount)
      throw new RequestError(
        404,
        "Project not found. Refresh your collection.",
      );
    return response
      .status(200)
      .json({
        message: restoring ? "Project restored." : "Project removed.",
        id,
      });
  } catch (error) {
    return sendError(response, error, "PROJECTS_ERROR");
  }
}
