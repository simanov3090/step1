"use client";

import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { formatPrice, menu, MenuProduct, menuPhoto } from "@/data/menu";

type CartItem = { product: MenuProduct; quantity: number };
type ContactMethod = "Telegram" | "WhatsApp" | "MAX";

type OrderRequest = {
  customer: { name: string; phone: string; email: string; city: string; address: string; comment: string };
  contactMethod: ContactMethod;
  items: CartItem[];
  total: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  add: (product: MenuProduct) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "vkusno-sushi-cart-v1";
const emptyCart: CartItem[] = [];
const cartListeners = new Set<() => void>();
let cartSnapshot: CartItem[] | null = null;

function readCart(value: string | null): CartItem[] {
  if (!value) return emptyCart;
  try {
    const parsed = JSON.parse(value) as CartItem[];
    if (!Array.isArray(parsed)) return emptyCart;
    return parsed.flatMap((item) => {
      const product = menu.find((candidate) => candidate.id === item.product?.id);
      return product && Number.isInteger(item.quantity) && item.quantity > 0
        ? [{ product, quantity: item.quantity }]
        : [];
    });
  } catch {
    return emptyCart;
  }
}

function getCartSnapshot() {
  if (typeof window === "undefined") return emptyCart;
  if (cartSnapshot === null) cartSnapshot = readCart(localStorage.getItem(storageKey));
  return cartSnapshot;
}

function subscribeCart(listener: () => void) {
  cartListeners.add(listener);
  function onStorage(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return;
    cartSnapshot = readCart(event.newValue);
    cartListeners.forEach((notify) => notify());
  }
  window.addEventListener("storage", onStorage);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function updateCart(update: (current: CartItem[]) => CartItem[]) {
  cartSnapshot = update(getCartSnapshot());
  try {
    localStorage.setItem(storageKey, JSON.stringify(cartSnapshot));
  } catch {
    // Keep the in-memory cart usable when storage is unavailable.
  }
  cartListeners.forEach((listener) => listener());
}

function getEmptyCartSnapshot() {
  return emptyCart;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getEmptyCartSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.body.classList.add("drawer-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("drawer-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function add(product: MenuProduct) {
    updateCart((current) => {
      const found = current.find((item) => item.product.id === product.id);
      return found
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1 }];
    });
  }

  function setQuantity(id: string, quantity: number) {
    if (quantity < 1) {
      updateCart((current) => current.filter((item) => item.product.id !== id));
      return;
    }
    updateCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity } : item));
  }

  function remove(id: string) {
    updateCart((current) => current.filter((item) => item.product.id !== id));
  }

  function clear() {
    updateCart(() => []);
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, isOpen, setIsOpen, add, setQuantity, remove, clear }}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { items, count, total, isOpen, setIsOpen, setQuantity, remove, clear } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState<ContactMethod>("Telegram");
  const [submittedOrder, setSubmittedOrder] = useState<OrderRequest | null>(null);
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const order: OrderRequest = {
      customer: {
        name: String(form.get("name")),
        phone: String(form.get("phone")),
        email: String(form.get("email") ?? ""),
        city: String(form.get("city")),
        address: String(form.get("address")),
        comment: String(form.get("comment") ?? ""),
      },
      contactMethod,
      items,
      total,
    };
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const result = await response.json() as { orderId?: string; error?: string };
      if (!response.ok || !result.orderId) throw new Error(result.error ?? "Не удалось отправить заказ.");
      setSubmittedOrder(order);
      setSubmittedOrderId(result.orderId);
      clear();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Сервер недоступен. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  function closeDrawer() {
    setIsOpen(false);
    window.setTimeout(() => {
      setCheckoutOpen(false);
      setSubmittedOrder(null);
      setSubmittedOrderId("");
      setSubmitError("");
    }, 250);
  }

  return (
    <>
      <button className={`drawer-scrim ${isOpen ? "is-open" : ""}`} type="button" aria-label="Закрыть корзину" onClick={closeDrawer} tabIndex={isOpen ? 0 : -1} />
      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} role="dialog" aria-modal={isOpen} aria-label={checkoutOpen ? "Оформление заказа" : "Корзина"} aria-hidden={!isOpen} inert={!isOpen}>
        <div className="drawer-heading">
          <div>
            <span className="micro-label">{checkoutOpen ? "ДОСТАВКА" : "ВАШ ВЫБОР"}</span>
            <h2>{checkoutOpen ? "Оформление" : "Корзина"}<span>{!checkoutOpen && ` · ${count}`}</span></h2>
          </div>
          <button className="icon-button" type="button" aria-label="Закрыть" onClick={closeDrawer}>×</button>
        </div>

        {checkoutOpen ? (
          submittedOrder ? (
            <div className="order-success">
              <span className="success-mark">✳</span>
              <h3>Спасибо за заказ.</h3>
              <p>Заказ №{submittedOrderId.slice(0, 8).toUpperCase()} сохранён. Менеджер свяжется с вами в {submittedOrder.contactMethod} для подтверждения и оплаты.</p>
              <div className="success-total"><span>{submittedOrder.items.reduce((sum, item) => sum + item.quantity, 0)} позиции</span><strong>{formatPrice(submittedOrder.total)}</strong></div>
              <button className="button button--outline" type="button" onClick={closeDrawer}>Вернуться к меню</button>
            </div>
          ) : (
            <form className="checkout-form" onSubmit={submitOrder}>
              <button className="back-link" type="button" onClick={() => setCheckoutOpen(false)}>← Назад в корзину</button>
              <div className="checkout-fields">
                <label className="form-field"><span>ИМЯ *</span><input name="name" required autoComplete="name" placeholder="Ваше имя" /></label>
                <label className="form-field"><span>ТЕЛЕФОН *</span><input name="phone" required type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" /></label>
                <label className="form-field"><span>EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="name@example.com" /></label>
                <label className="form-field"><span>ГОРОД *</span><input name="city" required autoComplete="address-level2" placeholder="Москва" defaultValue="Москва" /></label>
                <label className="form-field field-wide"><span>АДРЕС ДОСТАВКИ *</span><input name="address" required autoComplete="street-address" placeholder="Улица, дом, квартира" /></label>
                <label className="form-field field-wide"><span>КОММЕНТАРИЙ</span><textarea name="comment" rows={2} placeholder="Домофон, пожелания к заказу" /></label>
              </div>
              <fieldset className="messenger-choice">
                <legend>ГДЕ УДОБНО ПРОДОЛЖИТЬ?</legend>
                <div>{(["Telegram", "WhatsApp", "MAX"] as const).map((method) => <label className={contactMethod === method ? "messenger-option selected" : "messenger-option"} key={method}><input type="radio" name="contactMethod" value={method} checked={contactMethod === method} onChange={() => setContactMethod(method)} /><span className="radio-dot" />{method}</label>)}</div>
              </fieldset>
              {submitError && <p className="checkout-disclaimer admin-error" role="alert">{submitError}</p>}
              <p className="checkout-disclaimer">Менеджер подтвердит заказ и согласует оплату. На сайте оплаты нет.</p>
              <div className="drawer-total"><span>Итого</span><strong>{formatPrice(total)}</strong></div>
              <button className="button button--copper full-width" type="submit" disabled={submitting}>{submitting ? "Отправляем…" : "Отправить заказ"} <span>↗</span></button>
            </form>
          )
        ) : items.length === 0 ? (
          <div className="empty-cart"><span className="empty-emblem">味</span><h3>Здесь пока пусто</h3><p>Пусть первым будет ваш любимый ролл.</p><button className="button button--copper" type="button" onClick={closeDrawer}>Продолжить покупки</button></div>
        ) : (
          <>
            <div className="cart-items">{items.map(({ product, quantity }) => <article className="cart-item" key={product.id}>
              <div className="cart-item-image" style={{ backgroundImage: `url("${menuPhoto(product.image, 240)}")` }} role="img" aria-label={product.name} />
              <div className="cart-item-details"><h3>{product.name}</h3><span>{formatPrice(product.price)}</span><div className="quantity-stepper"><button type="button" aria-label={`Уменьшить ${product.name}`} onClick={() => setQuantity(product.id, quantity - 1)}>−</button><span>{quantity}</span><button type="button" aria-label={`Добавить ${product.name}`} onClick={() => setQuantity(product.id, quantity + 1)}>+</button></div></div>
              <div className="cart-item-end"><strong>{formatPrice(product.price * quantity)}</strong><button type="button" className="remove-item" onClick={() => remove(product.id)}>Удалить</button></div>
            </article>)}</div>
            <div className="drawer-footer"><div className="drawer-total"><span>Итого</span><strong>{formatPrice(total)}</strong></div><p>Доставка рассчитывается при подтверждении.</p><button className="button button--copper full-width" type="button" onClick={() => setCheckoutOpen(true)}>Оформить заказ <span>↗</span></button><button className="continue-button" type="button" onClick={closeDrawer}>Продолжить покупки</button></div>
          </>
        )}
      </aside>
    </>
  );
}