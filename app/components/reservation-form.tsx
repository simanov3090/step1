"use client";

import { FormEvent, useState } from "react";

export function ReservationForm() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <div className="reservation-success scroll-reveal" role="status"><span>✳</span><h2>Заявка принята.</h2><p>Скоро позвоним и подтвердим бронь.</p><button className="back-link" type="button" onClick={() => setSubmitted(false)}>Забронировать ещё раз</button></div>;
  }

  return (
    <form className="reservation-form scroll-reveal" onSubmit={submit}>
      <div className="form-heading"><span>ВАШ ВЕЧЕР</span><span>ЗАЯВКА · 01</span></div>
      <label className="form-field"><span>ИМЯ *</span><input name="name" autoComplete="name" required placeholder="Как к вам обращаться" /></label>
      <label className="form-field"><span>ТЕЛЕФОН *</span><input name="phone" type="tel" autoComplete="tel" required placeholder="+7 (___) ___-__-__" /></label>
      <div className="reservation-row">
        <label className="form-field"><span>ДАТА *</span><input name="date" type="date" required min={new Date().toISOString().slice(0, 10)} /></label>
        <label className="form-field"><span>ВРЕМЯ *</span><input name="time" type="time" required defaultValue="19:00" /></label>
      </div>
      <label className="form-field"><span>ГОСТИ *</span><select name="guests" defaultValue="2" required><option value="1">1 гость</option><option value="2">2 гостя</option><option value="3">3 гостя</option><option value="4">4 гостя</option><option value="5">5 гостей</option><option value="6">6 гостей</option><option value="7">6+ гостей</option></select></label>
      <label className="form-field"><span>ПОЖЕЛАНИЕ</span><textarea name="comment" rows={2} placeholder="Например, столик у окна" /></label>
      <button className="button button--copper full-width" type="submit">Забронировать <span>↗</span></button>
      <p className="form-hint">Мы свяжемся с вами для подтверждения.</p>
    </form>
  );
}