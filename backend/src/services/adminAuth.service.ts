import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

const adminAccessKey = process.env.ADMIN_ACCESS_KEY ?? "123456";
const adminSessionSecret = process.env.ADMIN_SESSION_SECRET ?? adminAccessKey;

type AdminTokenPayload = {
  exp: number;
};

function encodePayload(payload: AdminTokenPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signValue(value: string) {
  return createHmac("sha256", adminSessionSecret)
    .update(value)
    .digest("base64url");
}

export function createAdminToken() {
  const payload = encodePayload({ exp: Date.now() + TOKEN_TTL_MS });

  return `${payload}.${signValue(payload)}`;
}

export function isValidAccessKey(accessKey: string) {
  return accessKey === adminAccessKey;
}

export function verifyAdminToken(token: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signValue(payload);
  const expectedBuffer = Buffer.from(expectedSignature);
  const providedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminTokenPayload;

    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export function extractBearerToken(authorizationHeader?: string | null) {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}