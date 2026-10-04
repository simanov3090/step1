import Link from "next/link";
import { HeroScene } from "@/app/components/hero-scene";
import { ProductCatalog } from "@/app/components/product-catalog";
import { menuPhoto } from "@/data/menu";

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-backdrop" />
        <div className="hero-haze" />
        <HeroScene />
        <div className="hero-copy hero-glass">
          <span className="eyebrow"><i /> ЯПОНСКАЯ КУХНЯ · СОВРЕМЕННАЯ ПОДАЧА</span>
          <h1>Вкусно<br /><em>Суши</em></h1>
          <p>Суши, которые хочется рассматривать.</p>
          <Link className="button button--copper" href="#catalog">Смотреть меню <span>↘</span></Link>
        </div>
      </section>
      <ProductCatalog />
      <section className="brand-close">
        <div className="brand-close-image" role="img" aria-label="Тёплый интерьер ресторана Вкусно Суши" style={{ backgroundImage: `url("${menuPhoto("photo-1517248135467-4c7edcad34c4", 1900)}")` }} />
        <div className="brand-close-shade" />
        <div className="brand-close-copy scroll-reveal">
          <span className="eyebrow"><i /> ВКУСНО СУШИ · МОСКВА</span>
          <h2>Останьтесь<br />на <em>ещё один ролл.</em></h2>
          <p>Тёплый свет, свежий улов и столик, который уже ждёт.</p>
          <Link className="button button--copper" href="/reservation">Забронировать столик <span>↗</span></Link>
        </div>
      </section>
    </main>
  );
}