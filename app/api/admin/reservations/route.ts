import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isOrderStorageReady } from "@/lib/orders";
import { listReservations } from "@/lib/reservations";

export const runtime = "nodejs";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Нужен вход администратора." }, { status: 401 });
  if (!isOrderStorageReady()) return NextResponse.json({ error: "Подключите постоянное хранилище бронирований." }, { status: 503 });
  try {
    return NextResponse.json({ reservations: await listReservations() }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить бронирования." }, { status: 500 });
  }
}
