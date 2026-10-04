import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredReservation } from "@/lib/reservation-types";
import { isOrderStorageReady } from "@/lib/orders";

const directory = path.join(process.cwd(), ".data");
const file = path.join(directory, "reservations.json");
let writeQueue = Promise.resolve();
type ReservationRow = Omit<StoredReservation, "createdAt"> & { created_at: string };

async function remote(method: "GET" | "POST", reservation?: StoredReservation) {
  const response = await fetch(`${process.env.SUPABASE_URL!.replace(/\/+$/, "")}/rest/v1/reservations?select=*&order=created_at.desc`, {
    method,
    cache: "no-store",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: reservation ? JSON.stringify({ ...reservation, createdAt: undefined, created_at: reservation.createdAt }) : undefined,
  });
  if (!response.ok) throw new Error(`Reservation storage returned ${response.status}`);
  const rows = await response.json() as ReservationRow[];
  return rows.map(({ created_at, ...row }) => ({ ...row, createdAt: created_at }));
}

async function readReservations(): Promise<StoredReservation[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    if (!Array.isArray(parsed)) throw new Error("Invalid reservation storage");
    return parsed as StoredReservation[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function listReservations() {
  if (!isOrderStorageReady()) throw new Error("Production reservation storage is not configured");
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return remote("GET");
  return readReservations();
}

export async function saveReservation(input: Omit<StoredReservation, "id" | "createdAt">) {
  if (!isOrderStorageReady()) throw new Error("Production reservation storage is not configured");
  const reservation: StoredReservation = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const saved = await remote("POST", reservation);
    if (!saved[0]) throw new Error("Reservation was not returned by storage");
    return saved[0];
  }
  const operation = writeQueue.then(async () => {
    const reservations = await readReservations();
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const temporary = `${file}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify([reservation, ...reservations]), { mode: 0o600 });
    await rename(temporary, file);
    return reservation;
  });
  writeQueue = operation.then(() => undefined, () => undefined);
  return operation;
}
