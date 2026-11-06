import { scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "portfolio_session";
const SESSION_DURATION = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 64) {
    throw new Error("A valid SESSION_SECRET is required.");
  }

  return new TextEncoder().encode(secret);
}

export function verifyCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !storedHash) {
    throw new Error("Admin credentials are missing.");
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    password.length > 1024
  ) {
    return false;
  }

  if (!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/i.test(storedHash)) {
    throw new Error("Invalid admin password hash.");
  }

  const [, salt, hash] = storedHash.split(":");
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);

  return (
    timingSafeEqual(actual, expected) &&
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase()
  );
}

export async function createSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("portfolio-admin")
    .setIssuer("portfolio")
    .setAudience("portfolio-admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());
}

export async function getSession(request) {
  const cookie = (request.headers.cookie || "")
    .split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return null;

  const token = cookie.slice(COOKIE_NAME.length + 1);
  const secret = getSecret();

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: "portfolio",
      audience: "portfolio-admin",
    });

    if (
      payload.role !== "admin" ||
      payload.sub !== "portfolio-admin"
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function sessionCookie(token, clear = false) {
  const parts = [
    `${COOKIE_NAME}=${clear ? "" : token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${clear ? 0 : SESSION_DURATION}`,
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}