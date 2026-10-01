import { NextResponse } from "next/server";
import { menu } from "@/data/menu";
import { saveOrder } from "@/lib/orders";

export const runtime = "nodejs";

const contactMethods = new Set(["Telegram", "WhatsApp", "MAX"]);
const requests = new Map<string, { startedAt: number; count: number }>();

function limited(ip: string) {
  const now = Date.now();
  const record = requests.get(ip);
  if (!record || now - record.startedAt > 60_000) {
    requests.set(ip, { startedAt: now, count: 1 });
    return false;
  }
  record.count += 1;
  return record.count > 12;
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: "Приём заказов пока не настроен." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже." }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заказ." }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({ error: "Проверьте данные заказа." }, { status: 400 });
  const payload = body as Record<string, unknown>;
  const customer = payload.customer as Record<string, unknown> | undefined;
  const items = payload.items;
  const contactMethod = payload.contactMethod;

  if (!customer || !text(customer.name, 120) || !text(customer.phone, 40) || !text(customer.city, 120) || !text(customer.address, 500)) {
    return NextResponse.json({ error: "Заполните имя, телефон, город и адрес доставки." }, { status: 400 });
  }
  if (customer.email !== "" && customer.email !== undefined && (!text(customer.email, 254) || !String(customer.email).includes("@"))) {
    return NextResponse.json({ error: "Проверьте электронную почту." }, { status: 400 });
  }
  if (typeof contactMethod !== "string" || !contactMethods.has(contactMethod)) {
    return NextResponse.json({ error: "Выберите удобный способ связи." }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
    return NextResponse.json({ error: "Корзина пуста или содержит слишком много позиций." }, { status: 400 });
  }

  const orderItems = [];
  for (const item of items) {
    if (!item || typeof item !== "object") return NextResponse.json({ error: "Некорректная позиция заказа." }, { status: 400 });
    const line = item as Record<string, unknown>;
    const productId = (line.product as Record<string, unknown> | undefined)?.id;
    const quantity = line.quantity;
    const product = menu.find((entry) => entry.id === productId);
    if (!product || !Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 99) {
      return NextResponse.json({ error: "Некорректная позиция заказа." }, { status: 400 });
    }
    orderItems.push({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: Number(quantity),
    });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  try {
    const order = await saveOrder({
      customer: {
        name: String(customer.name).trim(),
        phone: String(customer.phone).trim(),
        email: typeof customer.email === "string" ? customer.email.trim() : "",
        city: String(customer.city).trim(),
        address: String(customer.address).trim(),
        comment: typeof customer.comment === "string" ? customer.comment.trim().slice(0, 1000) : "",
      },
      contactMethod: contactMethod as "Telegram" | "WhatsApp" | "MAX",
      items: orderItems,
      total,
    });
    return NextResponse.json({ orderId: order.id, message: "Заказ принят менеджером." }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить заказ. Попробуйте ещё раз." }, { status: 500 });
  }
}