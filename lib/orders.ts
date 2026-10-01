import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { type OrderStatus, type StoredOrder } from "@/lib/order-types";

export { orderStatuses } from "@/lib/order-types";
export type { OrderStatus, StoredOrder } from "@/lib/order-types";

type NewOrder = Omit<StoredOrder, "id" | "createdAt" | "status">;

const storeDirectory = path.join(process.cwd(), ".data");
const storePath = path.join(storeDirectory, "orders.json");
let writeQueue = Promise.resolve();

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
  return readOrders();
}

export function saveOrder(input: NewOrder) {
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

export function changeOrderStatus(id: string, status: OrderStatus) {
  return serialize(async () => {
    const orders = await readOrders();
    const order = orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = status;
    await writeOrders(orders);
    return order;
  });
}