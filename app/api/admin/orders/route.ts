import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { changeOrderStatus, isOrderStorageReady, listOrders, orderStatuses } from "@/lib/orders";

export const runtime = "nodejs";

export async function GET() {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Нужен вход администратора." }, { status: 401 });
  if (!isOrderStorageReady()) return NextResponse.json({ error: "Для production подключите постоянное хранилище заказов." }, { status: 503 });
  try {
    const orders = await listOrders();
    return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить заказы." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ error: "Нужен вход администратора." }, { status: 401 });
  if (!isOrderStorageReady()) return NextResponse.json({ error: "Для production подключите постоянное хранилище заказов." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Проверьте запрос." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Проверьте запрос." }, { status: 400 });
  const payload = body as Record<string, unknown>;
  if (typeof payload.id !== "string" || typeof payload.status !== "string" || !orderStatuses.includes(payload.status as (typeof orderStatuses)[number])) {
    return NextResponse.json({ error: "Некорректный статус заказа." }, { status: 400 });
  }

  try {
    const order = await changeOrderStatus(payload.id, payload.status as (typeof orderStatuses)[number]);
    if (!order) return NextResponse.json({ error: "Заказ не найден." }, { status: 404 });
    return NextResponse.json({ order }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return NextResponse.json({ error: "Не удалось изменить статус." }, { status: 500 });
  }
}