import Link from "next/link";
import { HeroScene } from "@/app/components/hero-scene";
import { ProductCatalog } from "@/app/components/product-catalog";

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
    </main>
  );
}