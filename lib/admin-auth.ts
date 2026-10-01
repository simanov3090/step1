import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const adminCookieName = "vkusno_admin_session";
const sessionDurationSeconds = 60 * 60 * 12;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function adminCredentialsMatch(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME ?? "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || !sessionSecret()) return false;
  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

export function getSessionDurationSeconds() {
  return sessionDurationSeconds;
}

export function createAdminSessionToken() {
  const secret = sessionSecret();
  const username = process.env.ADMIN_USERNAME ?? "admin";
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const payload = `${username}.${Date.now() + sessionDurationSeconds * 1000}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isValidAdminSession(token: string | undefined) {
  const secret = sessionSecret();
  if (!secret || !token) return false;
  const signatureSeparator = token.lastIndexOf(".");
  if (signatureSeparator < 1) return false;

  const payload = token.slice(0, signatureSeparator);
  const signature = token.slice(signatureSeparator + 1);
  const expectedSignature = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(signature, expectedSignature)) return false;

  const payloadSeparator = payload.lastIndexOf(".");
  if (payloadSeparator < 1) return false;
  const username = payload.slice(0, payloadSeparator);
  const expiresAt = Number(payload.slice(payloadSeparator + 1));
  return username === (process.env.ADMIN_USERNAME ?? "admin") && Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(adminCookieName)?.value);
}