"use client";

import { FormEvent, useState } from "react";
import { reservationToday } from "@/lib/reservation-types";

export function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), phone: form.get("phone"), date: form.get("date"), time: form.get("time"), guests: Number(form.get("guests")), comment: form.get("comment") }),
      });
      const result = await response.json() as { reservationId?: string; error?: string };
      if (!response.ok || !result.reservationId) throw new Error(result.error ?? "Не удалось отправить заявку.");
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Сервер недоступен. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <div className="reservation-success scroll-reveal" role="status"><span>✳</span><h2>Заявка принята.</h2><p>Скоро позвоним и подтвердим бронь.</p><button className="back-link" type="button" onClick={() => setSubmitted(false)}>Забронировать ещё раз</button></div>;
  }

  return (
    <form className="reservation-form scroll-reveal" onSubmit={submit}>
      <div className="form-heading"><span>ВАШ ВЕЧЕР</span><span>ЗАЯВКА · 01</span></div>
      <label className="form-field"><span>ИМЯ *</span><input name="name" maxLength={120} autoComplete="name" required placeholder="Как к вам обращаться" /></label>
      <label className="form-field"><span>ТЕЛЕФОН *</span><input name="phone" maxLength={40} type="tel" autoComplete="tel" required placeholder="+7 (___) ___-__-__" /></label>
      <div className="reservation-row">
        <label className="form-field"><span>ДАТА *</span><input name="date" type="date" required min={reservationToday()} /></label>
        <label className="form-field"><span>ВРЕМЯ *</span><input name="time" type="time" min="12:00" max="23:59" required defaultValue="19:00" /></label>
      </div>
      <label className="form-field"><span>ГОСТИ *</span><select name="guests" defaultValue="2" required><option value="1">1 гость</option><option value="2">2 гостя</option><option value="3">3 гостя</option><option value="4">4 гостя</option><option value="5">5 гостей</option><option value="6">6 гостей</option><option value="7">6+ гостей</option></select></label>
      <label className="form-field"><span>ПОЖЕЛАНИЕ</span><textarea name="comment" maxLength={1000} rows={2} placeholder="Например, столик у окна" /></label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="button button--copper full-width" type="submit" disabled={submitting}>{submitting ? "Отправляем…" : "Забронировать"} <span>↗</span></button>
      <p className="form-hint">Время по Москве. Мы свяжемся с вами для подтверждения.</p>
    </form>
  );
}