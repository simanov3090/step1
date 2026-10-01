"use client";

import { MenuProduct, formatPrice } from "@/data/menu";
import { useCart } from "@/app/components/cart-provider";

export function ProductDetailActions({ product }: { product: MenuProduct }) {
  const { items, add, setQuantity } = useCart();
  const quantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;

  if (quantity > 0) {
    return (
      <div className="detail-actions">
        <div className="detail-quantity" aria-label={`${quantity} в корзине`}>
          <button type="button" aria-label={`Уменьшить ${product.name}`} onClick={() => setQuantity(product.id, quantity - 1)}>−</button>
          <span>{quantity} <small>В КОРЗИНЕ</small></span>
          <button type="button" aria-label={`Добавить ещё ${product.name}`} onClick={() => add(product)}>+</button>
        </div>
        <strong>{formatPrice(product.price * quantity)}</strong>
      </div>
    );
  }

  return <button className="button button--copper detail-add" type="button" onClick={() => add(product)}>Добавить в корзину <span>{formatPrice(product.price)}</span></button>;
}