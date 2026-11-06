import test, { beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import { scryptSync } from "node:crypto";
import { Binary } from "mongodb";
import {
  createSession,
  getSession,
  verifyCredentials,
  sessionCookie,
} from "../server/auth.js";
import { validateProject } from "../server/projects.js";

process.env.SESSION_SECRET = "a".repeat(64);
process.env.ADMIN_EMAIL = "admin@example.test";
process.env.MONGODB_URI = "mongodb://unused.test";
process.env.MONGODB_DB = "isolated-tests";
const salt = "b".repeat(32);
process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt}:${scryptSync("test-password-long", salt, 64).toString("hex")}`;

const tables = new Map();
function matches(document, filter) {
  return Object.entries(filter).every(([key, value]) =>
    value && typeof value === "object" && "$exists" in value
      ? Object.hasOwn(document, key) === value.$exists
      : document[key] === value,
  );
}
function collection(name) {
  if (!tables.has(name)) tables.set(name, new Map());
  const records = tables.get(name);
  return {
    async insertOne(document) {
      records.set(document._id, { ...document });
      return { insertedId: document._id };
    },
    async findOne(filter) {
      return (
        [...records.values()].find((document) => matches(document, filter)) ||
        null
      );
    },
    find(filter) {
      return {
        sort() {
          return {
            async toArray() {
              return [...records.values()].filter((document) =>
                matches(document, filter),
              );
            },
          };
        },
      };
    },
    async findOneAndUpdate(filter, update, options) {
      let document = [...records.values()].find((document) =>
        matches(document, filter),
      );
      if (!document && !options?.upsert) return null;
      document ||= { ...filter, ...update.$setOnInsert };
      Object.assign(document, update.$set || {});
      for (const [key, value] of Object.entries(update.$inc || {}))
        document[key] = (document[key] || 0) + value;
      records.set(document._id, document);
      return { ...document };
    },
    async updateOne(filter, update) {
      const document = [...records.values()].find((document) =>
        matches(document, filter),
      );
      if (!document) return { matchedCount: 0 };
      Object.assign(document, update.$set || {});
      for (const key of Object.keys(update.$unset || {})) delete document[key];
      return { matchedCount: 1 };
    },
  };
}
mock.module("../server/db.js", {
  exports: { getDatabase: async () => ({ collection }) },
});
const { default: projectsApi } = await import("../api/projects.js");
const { default: profileApi } = await import("../api/profile.js");
const { default: mediaApi } = await import("../api/media.js");
const { default: loginApi } = await import("../api/auth/login.js");
const { default: sessionApi } = await import("../api/auth/session.js");
const { default: logoutApi } = await import("../api/auth/logout.js");

beforeEach(() => tables.clear());
function response() {
  return {
    code: 200,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.code = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    },
    send(data) {
      this.data = data;
      return this;
    },
  };
}
async function call(
  handler,
  method,
  body,
  { authenticated = true, origin = "http://localhost:3000", query = {} } = {},
) {
  const headers = {
    host: "localhost:3000",
    origin,
    "content-type": "application/json",
  };
  if (authenticated)
    headers.cookie = `portfolio_session=${await createSession()}`;
  const res = response();
  await handler({ method, headers, body, query }, res);
  return res;
}
const project = {
  title: "Demo",
  category: "Website",
  description: "A meaningful test project.",
  image: "/project.png",
  demo: "https://example.test",
  source: "",
  technologies: ["React"],
  features: ["Responsive"],
  number: "03",
};

test("password and signed session verification reject wrong credentials and tampering", async () => {
  assert.equal(
    verifyCredentials("ADMIN@example.test", "test-password-long"),
    true,
  );
  assert.equal(verifyCredentials("admin@example.test", "wrong"), false);
  const token = await createSession();
  assert.equal(
    (await getSession({ headers: { cookie: `portfolio_session=${token}` } }))
      .role,
    "admin",
  );
  assert.equal(
    await getSession({ headers: { cookie: `portfolio_session=${token}x` } }),
    null,
  );
  assert.match(sessionCookie(token), /HttpOnly/);
  assert.match(sessionCookie("", true), /Max-Age=0/);
});

test("all project writes require a signed session and same-origin requests", async () => {
  for (const method of ["POST", "PUT", "DELETE", "PATCH"]) {
    assert.equal(
      (await call(projectsApi, method, project, { authenticated: false })).code,
      401,
    );
    assert.equal(
      (
        await call(projectsApi, method, project, {
          origin: "https://attacker.test",
        })
      ).code,
      403,
    );
  }
  assert.equal(
    (await call(projectsApi, "POST", project, { origin: null })).code,
    403,
  );
});

test("project create, update, public read, remove and restore preserve content", async () => {
  const created = await call(projectsApi, "POST", { ...project, admin: true });
  assert.equal(created.code, 201);
  const id = created.data.project.id;
  assert.equal(created.data.project.admin, undefined);
  const edited = await call(
    projectsApi,
    "PUT",
    { ...project, title: "Updated" },
    { query: { id } },
  );
  assert.equal(edited.data.project.title, "Updated");
  assert.equal(
    (await call(projectsApi, "GET", undefined, { authenticated: false })).data
      .projects.length,
    1,
  );
  assert.equal(
    (await call(projectsApi, "DELETE", {}, { query: { id } })).code,
    200,
  );
  assert.equal((await call(projectsApi, "GET")).data.projects.length, 0);
  assert.equal(
    (await call(projectsApi, "PATCH", {}, { query: { id } })).code,
    200,
  );
  assert.equal(
    (await call(projectsApi, "GET")).data.projects[0].title,
    "Updated",
  );
});

test("seeded string IDs can be edited; nonexistent IDs are not created by update", async () => {
  await collection("projects").insertOne({
    _id: "personal-portfolio",
    ...project,
  });
  assert.equal(
    (
      await call(projectsApi, "PUT", project, {
        query: { id: "personal-portfolio" },
      })
    ).code,
    200,
  );
  assert.equal(
    (await call(projectsApi, "PUT", project, { query: { id: "missing" } }))
      .code,
    404,
  );
});

test("validation rejects blank titles, script URLs, oversized lists and unknown properties", async () => {
  for (const values of [
    { ...project, title: " " },
    { ...project, demo: "javascript:alert(1)" },
    { ...project, image: "//attacker.test/a.png" },
    { ...project, features: Array(31).fill("a") },
  ]) {
    assert.equal((await call(projectsApi, "POST", values)).code, 400);
  }
  const safe = validateProject({
    ...project,
    _id: "override",
    $set: { title: "attack" },
  });
  assert.equal(safe._id, undefined);
  assert.equal(safe.$set, undefined);
});

test("profile/settings writes stay separate and private fields are never returned", async () => {
  assert.equal(
    (await call(profileApi, "PUT", {}, { authenticated: false })).code,
    401,
  );
  const defaults = (
    await call(profileApi, "GET", undefined, { authenticated: false })
  ).data.profile;
  const changed = await call(profileApi, "PUT", {
    section: "profile",
    values: { ...defaults, name: "Test Person", SESSION_SECRET: "hidden" },
  });
  assert.equal(changed.data.profile.name, "Test Person");
  assert.equal(changed.data.profile.SESSION_SECRET, undefined);
  const settings = await call(profileApi, "PUT", {
    section: "settings",
    values: {
      whatsapp: "923001234567",
      github: "https://github.com/example",
      linkedin: "",
      instagram: "",
    },
  });
  assert.equal(settings.data.profile.name, "Test Person");
  assert.equal(settings.data.profile.whatsapp, "923001234567");
  assert.equal(
    (
      await call(profileApi, "PUT", {
        section: "settings",
        values: { whatsapp: "+bad" },
      })
    ).code,
    400,
  );
});

test("image uploads require authentication and valid bytes; public retrieval returns exact bytes", async () => {
  const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
  const body = { contentType: "image/png", data: png.toString("base64") };
  assert.equal(
    (await call(mediaApi, "POST", body, { authenticated: false })).code,
    401,
  );
  assert.equal(
    (
      await call(mediaApi, "POST", {
        contentType: "image/png",
        data: Buffer.from("fake").toString("base64"),
      })
    ).code,
    400,
  );
  const result = await call(mediaApi, "POST", body);
  assert.equal(result.code, 201);
  const id = new URL(result.data.url, "http://localhost").searchParams.get(
    "id",
  );
  const stored = await collection("assets").findOne({ _id: id });
  stored.data = new Binary(png);
  const image = await call(mediaApi, "GET", undefined, {
    authenticated: false,
    query: { id },
  });
  assert.equal(image.headers["Content-Type"], "image/png");
  assert.deepEqual(image.data, png);
});

test("login returns a cookie, session validates it, logout clears it", async () => {
  const login = await call(
    loginApi,
    "POST",
    { email: "admin@example.test", password: "test-password-long" },
    { authenticated: false },
  );
  assert.equal(login.code, 200);
  const cookie = login.headers["Set-Cookie"];
  const res = response();
  await sessionApi({ method: "GET", headers: { cookie } }, res);
  assert.equal(res.data.authenticated, true);
  const logout = await call(logoutApi, "POST", {});
  assert.match(logout.headers["Set-Cookie"], /Max-Age=0/);
});

test("login attempt limit is enforced without revealing password validity", async () => {
  for (let i = 0; i < 10; i++)
    assert.equal(
      (
        await call(
          loginApi,
          "POST",
          { email: "admin@example.test", password: "wrong" },
          { authenticated: false },
        )
      ).code,
      401,
    );
  assert.equal(
    (
      await call(
        loginApi,
        "POST",
        { email: "admin@example.test", password: "test-password-long" },
        { authenticated: false },
      )
    ).code,
    429,
  );
});
