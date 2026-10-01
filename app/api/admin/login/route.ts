import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, adminCredentialsMatch, createAdminSessionToken, getSessionDurationSeconds } from "@/lib/admin-auth";

export const runtime = "nodejs";

const failures = new Map<string, { startedAt: number; count: number }>();

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Аккаунт администратора не настроен." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const attempt = failures.get(ip);
  if (attempt && now - attempt.startedAt < 5 * 60_000 && attempt.count >= 8) {
    return NextResponse.json({ error: "Слишком много попыток. Подождите 5 минут." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Проверьте имя и пароль." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Проверьте имя и пароль." }, { status: 400 });

  const credentials = body as Record<string, unknown>;
  if (typeof credentials.username !== "string" || typeof credentials.password !== "string" || !adminCredentialsMatch(credentials.username, credentials.password)) {
    if (!attempt || now - attempt.startedAt >= 5 * 60_000) failures.set(ip, { startedAt: now, count: 1 });
    else attempt.count += 1;
    return NextResponse.json({ error: "Неверный логин или пароль." }, { status: 401 });
  }

  failures.delete(ip);
  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: getSessionDurationSeconds(),
  });
  return NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
}