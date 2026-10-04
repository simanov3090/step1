"use client";

import { CSSProperties, useState } from "react";
import Link from "next/link";
import { formatPrice, menu, menuCategories, MenuFilter, menuPhoto } from "@/data/menu";
import { useCart } from "@/app/components/cart-provider";

export function ProductCatalog() {
  const [filter, setFilter] = useState<MenuFilter>("Все");
  const { items, add, setQuantity } = useCart();
  const products = filter === "Все" ? menu : menu.filter((product) => product.category === filter);

  return (
    <section className="catalog-section" aria-label="Каталог блюд">
      <div className="catalog-heading scroll-reveal">
        <div><span className="eyebrow"><i /> РУЧНАЯ РАБОТА · СВЕЖИЙ УЛОВ</span><h2>Наши <em>роллы</em></h2></div>
        <span className="catalog-count">{String(products.length).padStart(2, "0")} ПОЗИЦИЙ</span>
      </div>
      <div className="catalog-filters scroll-reveal" role="tablist" aria-label="Категории меню">
        {menuCategories.map((category) => <button key={category} type="button" role="tab" aria-selected={filter === category} className={filter === category ? "filter-chip active" : "filter-chip"} onClick={() => setFilter(category)}>{category}</button>)}
      </div>
      <div className="product-grid" id="catalog" key={filter}>
        {products.map((product, index) => {
          const quantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
          return <article className="product-card scroll-reveal" key={product.id} style={{ "--item-index": index } as CSSProperties}>
            <div className="product-photo">
              <Link className="product-photo-link" href={`/menu/${product.id}`} prefetch={false} aria-label={`Подробнее о блюде «${product.name}»`} style={{ backgroundImage: `linear-gradient(0deg, rgba(12, 10, 9, .42), transparent 60%), url("${menuPhoto(product.image, 780)}")` }} />
              {(product.popular || product.new) && <span className="product-badge">{product.new ? "НОВИНКА" : "ВЫБОР ГОСТЕЙ"}</span>}
              {quantity === 0 ? <button type="button" className="add-product" aria-label={`Добавить ${product.name}`} onClick={() => add(product)}>+</button> : <div className="product-quantity"><button type="button" aria-label={`Уменьшить ${product.name}`} onClick={() => setQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button type="button" aria-label={`Добавить ещё ${product.name}`} onClick={() => add(product)}>+</button></div>}
            </div>
            <div className="product-details"><div><h3><Link href={`/menu/${product.id}`} prefetch={false}>{product.name}</Link></h3><p>{product.description}</p></div><strong>{formatPrice(product.price)}</strong></div>
          </article>;
        })}
      </div>
      <p className="catalog-note scroll-reveal">Готовим сразу после заказа.</p>
    </section>
  );
}