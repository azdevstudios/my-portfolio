import { text, webUrl, RequestError } from "./http.js";

function list(value, label) {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 30)
    throw new RequestError(400, `${label} must contain 30 items or fewer.`);
  return [...new Set(value.map((item) => text(item, label, 180, true)))];
}

export function validateProject(body) {
  return {
    title: text(body.title, "Title", 120, true),
    category: text(body.category, "Category", 120, true),
    description: text(body.description, "Description", 2000, true),
    image: webUrl(body.image, "Cover image", true),
    demo: webUrl(body.demo, "Live website"),
    source: webUrl(body.source, "Source code"),
    features: list(body.features, "Features"),
    technologies: list(body.technologies, "Technologies"),
    number: text(body.number, "Display number", 8),
  };
}

export function publicProject(document) {
  return {
    id: document._id.toString(),
    ...Object.fromEntries(
      [
        "title",
        "category",
        "description",
        "image",
        "demo",
        "source",
        "number",
      ].map((key) => [key, document[key] || ""]),
    ),
    features: document.features || [],
    technologies: document.technologies || [],
  };
}
