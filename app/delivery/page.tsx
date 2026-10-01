import Link from "next/link";

export default function DeliveryPage() {
  return (
    <main className="service-page delivery-page">
      <div className="service-atmosphere" />
      <div className="service-shell">
        <Link className="back-home" href="/#top">← <span>На главную</span></Link>
        <div className="service-layout">
          <section className="service-copy scroll-reveal">
            <span className="eyebrow"><i /> БЕРЕЖНО К ВАШЕМУ ПОРОГУ</span>
            <h1>Вкусно.<br /><em>И уже в пути.</em></h1>
            <p>Любимые роллы — там, где вам удобно.</p>
            <div className="delivery-details">
              <div><span>ВРЕМЯ</span><strong>40–70 минут</strong></div>
              <div><span>СТОИМОСТЬ</span><strong>При подтверждении</strong></div>
              <div><span>ЗОНА</span><strong>Уточним по адресу</strong></div>
            </div>
            <Link className="button button--copper" href="/#catalog">Перейти в меню <span>↘</span></Link>
          </section>
          <div className="delivery-map scroll-reveal" role="img" aria-label="Схема маршрута доставки через город к вашему дому">
            <div className="map-halo" />
            <svg viewBox="0 0 560 500" aria-hidden="true" className="map-lines">
              <path d="M51 324 139 264l22-87 106 20 44-87 96 37 94-74M78 402l89-86 86 30 81-72 113 21 66-83M74 112l91 48 80-29 58 75 92-16 100 68M193 453l44-107-35-88 62-61 86 2 21-92" />
              <path className="route-line" d="m93 378 79-65 62 16 66-81 81 12 67-85" />
            </svg>
            <span className="map-point map-point--kitchen"><i /> НАША КУХНЯ</span>
            <span className="map-point map-point--home"><i /> ВАШ АДРЕС</span>
            <span className="map-kicker">МОСКВА · МАРШРУТ ЗАБОТЫ</span>
            <span className="map-time">40—70<small>МИН</small></span>
          </div>
        </div>
        <div className="service-footnote scroll-reveal"><span>Приготовим после заявки</span><span>Заказ подтвердит менеджер</span><span>Оплата — при согласовании</span></div>
      </div>
    </main>
  );
}