import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { type OrderStatus, type StoredOrder } from "@/lib/order-types";

export { orderStatuses } from "@/lib/order-types";
export type { OrderStatus, StoredOrder } from "@/lib/order-types";

type NewOrder = Omit<StoredOrder, "id" | "createdAt" | "status">;

type SupabaseOrder = {
  id: string;
  created_at: string;
  status: OrderStatus;
  customer: StoredOrder["customer"];
  contact_method: StoredOrder["contactMethod"];
  items: StoredOrder["items"];
  total: number;
};

const storeDirectory = path.join(process.cwd(), ".data");
const storePath = path.join(storeDirectory, "orders.json");
let writeQueue = Promise.resolve();

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

export function isOrderStorageReady() {
  return Boolean(supabaseConfig()) || process.env.NODE_ENV !== "production";
}

function assertProductionStorage() {
  if (process.env.NODE_ENV === "production" && !supabaseConfig()) {
    throw new Error("Production order storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

async function supabaseRequest<T>(query = "", init?: RequestInit): Promise<T> {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase order storage is not configured.");
  const response = await fetch(`${config.url}/rest/v1/orders${query}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) throw new Error(`Supabase order storage returned ${response.status}.`);
  return response.json() as Promise<T>;
}

function fromSupabase(row: SupabaseOrder): StoredOrder {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    customer: row.customer,
    contactMethod: row.contact_method,
    items: row.items,
    total: Number(row.total),
  };
}

async function readOrders(): Promise<StoredOrder[]> {
  try {
    const contents = await readFile(storePath, "utf8");
    const parsed: unknown = JSON.parse(contents);
    return Array.isArray(parsed) ? parsed as StoredOrder[] : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function writeOrders(orders: StoredOrder[]) {
  await mkdir(storeDirectory, { recursive: true, mode: 0o700 });
  const temporaryPath = `${storePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(orders), { encoding: "utf8", mode: 0o600 });
  await rename(temporaryPath, storePath);
}

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function listOrders() {
  const config = supabaseConfig();
  if (config) {
    const rows = await supabaseRequest<SupabaseOrder[]>("?select=*&order=created_at.desc");
    return rows.map(fromSupabase);
  }
  assertProductionStorage();
  return readOrders();
}

export async function saveOrder(input: NewOrder) {
  const config = supabaseConfig();
  if (config) {
    const row: SupabaseOrder = {
      id: randomUUID(),
      created_at: new Date().toISOString(),
      status: "new",
      customer: input.customer,
      contact_method: input.contactMethod,
      items: input.items,
      total: input.total,
    };
    const saved = await supabaseRequest<SupabaseOrder[]>("?select=*", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(row),
    });
    if (!saved[0]) throw new Error("Supabase did not return the saved order.");
    return fromSupabase(saved[0]);
  }
  assertProductionStorage();
  return serialize(async () => {
    const orders = await readOrders();
    const order: StoredOrder = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    await writeOrders([order, ...orders]);
    return order;
  });
}

export async function changeOrderStatus(id: string, status: OrderStatus) {
  if (supabaseConfig()) {
    const query = `?id=eq.${encodeURIComponent(id)}&select=*`;
    const rows = await supabaseRequest<SupabaseOrder[]>(query, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status }),
    });
    return rows[0] ? fromSupabase(rows[0]) : null;
  }
  assertProductionStorage();
  return serialize(async () => {
    const orders = await readOrders();
    const order = orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = status;
    await writeOrders(orders);
    return order;
  });
}