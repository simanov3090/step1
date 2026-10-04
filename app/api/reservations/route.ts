import { NextResponse } from "next/server";
import { isOrderStorageReady } from "@/lib/orders";
import { saveReservation } from "@/lib/reservations";
import { reservationToday } from "@/lib/reservation-types";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; expires: number }>();

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET || !isOrderStorageReady()) {
    return NextResponse.json({ error: "Приём бронирований пока не настроен." }, { status: 503 });
  }
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const attempt = attempts.get(ip) ?? { count: 0, expires: now + 60_000 };
  attempts.set(ip, attempt);
  if (++attempt.count > 12) return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже." }, { status: 429 });
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Не удалось прочитать заявку." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Проверьте данные заявки." }, { status: 400 });
  const data = body as Record<string, unknown>;
  const validText = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
  if (!validText(data.name, 120) || !validText(data.phone, 40)) return NextResponse.json({ error: "Заполните имя и телефон." }, { status: 400 });
  const date = typeof data.date === "string" ? data.date : "";
  const time = typeof data.time === "string" ? data.time : "";
  const timestamp = Date.parse(`${date}T${time}:00+03:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !Number.isFinite(timestamp) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date || date < reservationToday() || timestamp <= now || time < "12:00" || time > "23:59") {
    return NextResponse.json({ error: "Выберите будущую дату и время с 12:00 до 23:59 по Москве." }, { status: 400 });
  }
  if (!Number.isInteger(data.guests) || Number(data.guests) < 1 || Number(data.guests) > 7 || (data.comment !== undefined && (typeof data.comment !== "string" || data.comment.length > 1000))) return NextResponse.json({ error: "Проверьте количество гостей и пожелание." }, { status: 400 });
  try {
    const reservation = await saveReservation({ name: String(data.name).trim(), phone: String(data.phone).trim(), date, time, guests: Number(data.guests), comment: typeof data.comment === "string" ? data.comment.trim() : "" });
    return NextResponse.json({ reservationId: reservation.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить заявку. Попробуйте ещё раз." }, { status: 500 });
  }
}
