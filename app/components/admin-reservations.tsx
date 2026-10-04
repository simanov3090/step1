"use client";

import { useEffect, useState } from "react";
import type { StoredReservation } from "@/lib/reservation-types";

export function AdminReservations({ onUnauthorized }: { onUnauthorized: () => void }) {
  const [reservations, setReservations] = useState<StoredReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/admin/reservations", { cache: "no-store" });
        if (!active) return;
        if (response.status === 401) { onUnauthorized(); return; }
        const result = await response.json() as { reservations: StoredReservation[]; error?: string };
        if (!active) return;
        if (!response.ok) throw new Error(result.error ?? "Не удалось загрузить бронирования.");
        setReservations(result.reservations);
        setError("");
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "Сервер недоступен.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    const timer = window.setInterval(() => { void load(); }, 12_000);
    return () => { active = false; window.clearInterval(timer); };
  }, [refresh, onUnauthorized]);

  return <section aria-label="Бронирования столиков">
    <div className="admin-topline"><h2>Бронирования столиков · {reservations.length}</h2><button className="admin-refresh" type="button" onClick={() => setRefresh((value) => value + 1)}>Обновить бронирования</button></div>
    <p className="admin-updated">Время по Москве · автообновление 12 сек.</p>
    {error && <p className="admin-error" role="alert">{error}</p>}
    {loading ? <p role="status">Загружаем бронирования…</p> : !error && reservations.length === 0 ? <div className="admin-empty">Бронирований пока нет.</div> : null}
    <div className="admin-orders">{reservations.map((reservation) => <article className="admin-order" key={reservation.id}>
      <div className="admin-order-head"><span className="admin-order-id">#{reservation.id.slice(0, 8).toUpperCase()}</span><time dateTime={`${reservation.date}T${reservation.time.slice(0, 5)}:00+03:00`}>{reservation.date.split("-").reverse().join(".")} · {reservation.time.slice(0, 5)}</time></div>
      <div className="admin-order-grid"><section><span className="admin-section-label">ГОСТЬ</span><strong>{reservation.name}</strong><a href={`tel:${reservation.phone}`}>{reservation.phone}</a></section><section><span className="admin-section-label">КОЛИЧЕСТВО ГОСТЕЙ</span><strong>{reservation.guests === 7 ? "6+" : reservation.guests}</strong></section><section><span className="admin-section-label">ПОЖЕЛАНИЕ</span><span>{reservation.comment || "—"}</span></section></div>
    </article>)}</div>
  </section>;
}
