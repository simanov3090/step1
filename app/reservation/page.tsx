import Link from "next/link";
import { ReservationForm } from "@/app/components/reservation-form";

export default function ReservationPage() {
  return (
    <main className="service-page reservation-page">
      <div className="service-atmosphere" />
      <div className="service-shell">
        <Link className="back-home" href="/#top">← <span>На главную</span></Link>
        <div className="reservation-layout">
          <section className="service-copy scroll-reveal">
            <span className="eyebrow"><i /> НЕ СПЕШИТЕ УХОДИТЬ</span>
            <h1>Вечер<br /><em>ваш.</em></h1>
            <p>Выберите время — подготовим столик к вашему приходу.</p>
            <div className="reservation-address"><span className="address-pin">◎</span><div><span>ЖДЁМ ВАС</span><strong>Москва, Большая Никитская, 22</strong><small>Каждый день · 12:00 — 00:00</small></div></div>
          </section>
          <ReservationForm />
        </div>
      </div>
    </main>
  );
}