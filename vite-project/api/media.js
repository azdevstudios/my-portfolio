import { randomUUID } from "node:crypto";
import { getDatabase } from "../server/db.js";
import { requireAdminWrite, RequestError, sendError } from "../server/http.js";

export default async function handler(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    response.setHeader("Allow", "GET, POST");
    return response.status(405).json({ message: "Method not allowed." });
  }
  try {
    if (request.method === "POST") await requireAdminWrite(request);
    const database = await getDatabase();
    const assets = database.collection("assets");
    if (request.method === "GET") {
      const id = request.query?.id;
      if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id))
        throw new RequestError(404, "Image not found.");
      const image = await assets.findOne({ _id: id });
      if (!image) throw new RequestError(404, "Image not found.");
      response.setHeader("Content-Type", image.contentType);
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );
      return response
        .status(200)
        .send(
          Buffer.isBuffer(image.data)
            ? image.data
            : Buffer.from(image.data.value()),
        );
    }
    const { data, contentType } = request.body || {};
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(contentType) ||
      typeof data !== "string" ||
      data.length > 2800000 ||
      !/^[A-Za-z0-9+/]*={0,2}$/.test(data)
    )
      throw new RequestError(
        400,
        "Choose a PNG, JPG or WebP image under 2 MB.",
      );
    const bytes = Buffer.from(data, "base64");
    if (!bytes.length || bytes.length > 2 * 1024 * 1024)
      throw new RequestError(413, "Choose an image under 2 MB.");
    const valid =
      contentType === "image/png"
        ? bytes
            .subarray(0, 8)
            .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : contentType === "image/jpeg"
          ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : bytes.subarray(0, 4).toString() === "RIFF" &&
            bytes.subarray(8, 12).toString() === "WEBP";
    if (!valid)
      throw new RequestError(400, "This file is not a supported image.");
    const id = randomUUID();
    await assets.insertOne({
      _id: id,
      contentType,
      data: bytes,
      createdAt: new Date(),
    });
    response.setHeader("Cache-Control", "no-store");
    return response.status(201).json({ url: `/api/media?id=${id}` });
  } catch (error) {
    return sendError(response, error, "IMAGE_ERROR");
  }
}
