"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { orderStatuses, type StoredOrder, type OrderStatus } from "@/lib/order-types";
import { AdminReservations } from "@/app/components/admin-reservations";
import { formatPrice } from "@/data/menu";

const statusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  processing: "Готовится",
  completed: "Выполнен",
  cancelled: "Отменён",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function AdminConsole() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const handleUnauthorized = useCallback(() => setAuthenticated(false), []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/orders", { cache: "no-store" }).then(async (response) => {
      if (!active) return;
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error("Не удалось проверить доступ администратора.");
      const result = await response.json() as { orders: StoredOrder[] };
      setOrders(result.orders);
      setLastUpdated(new Date().toISOString());
      setAuthenticated(true);
    }).catch((requestError: unknown) => {
      if (!active) return;
      setError(requestError instanceof Error ? requestError.message : "Сервер временно недоступен.");
      setAuthenticated(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let active = true;
    async function refreshOrders(showSpinner = false) {
      if (showSpinner) setRefreshing(true);
      try {
        const response = await fetch("/api/admin/orders", { cache: "no-store" });
        if (response.status === 401) {
          if (active) setAuthenticated(false);
          return;
        }
        if (!response.ok) throw new Error("Не удалось обновить список заказов.");
        const result = await response.json() as { orders: StoredOrder[] };
        if (active) {
          setOrders(result.orders);
          setLastUpdated(new Date().toISOString());
          setError("");
        }
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "Сервер временно недоступен.");
      } finally {
        if (active && showSpinner) setRefreshing(false);
      }
    }
    void refreshOrders();
    const timer = window.setInterval(() => { void refreshOrders(); }, 12_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [authenticated]);

  async function logIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Не удалось войти.");
      setPassword("");
      setAuthenticated(true);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Не удалось войти.");
    } finally {
      setBusy(false);
    }
  }

  async function logOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    setOrders([]);
    setAuthenticated(false);
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setError("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await response.json() as { order?: StoredOrder; error?: string };
      if (!response.ok || !result.order) throw new Error(result.error ?? "Не удалось изменить статус.");
      setOrders((current) => current.map((order) => order.id === id ? result.order! : order));
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Не удалось изменить статус.");
    }
  }

  async function refreshNow() {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/orders", { cache: "no-store" });
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      const result = await response.json() as { orders: StoredOrder[]; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Не удалось обновить список заказов.");
      setOrders(result.orders);
      setLastUpdated(new Date().toISOString());
      setError("");
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : "Сервер временно недоступен.");
    } finally {
      setRefreshing(false);
    }
  }

  if (authenticated === null) return <main className="admin-page"><div className="admin-loading">Проверяем доступ…</div></main>;

  if (!authenticated) {
    return (
      <main className="admin-page">
        <section className="admin-login">
          <span className="admin-kicker">ВКУСНО СУШИ · BACK OFFICE</span>
          <h1>Вход <em>для команды.</em></h1>
          <p>Заказы доставки, бронирования и контакты гостей.</p>
          <form onSubmit={logIn}>
            <label className="admin-field"><span>ЛОГИН</span><input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} /></label>
            <label className="admin-field"><span>ПАРОЛЬ</span><input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="button button--copper full-width" type="submit" disabled={busy}>{busy ? "Проверяем…" : "Войти"}<span>↗</span></button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page admin-dashboard">
      <div className="admin-topline"><div><span className="admin-kicker">ВКУСНО СУШИ · BACK OFFICE</span><h1>Заказы <em>доставки.</em></h1></div><div className="admin-actions"><button className="admin-refresh" type="button" onClick={() => void refreshNow()} disabled={refreshing}>{refreshing ? "Обновляем…" : "Обновить"}</button><button className="admin-logout" type="button" onClick={() => void logOut()}>Выйти</button></div></div>
      <div className="admin-summary"><div><span>ВСЕГО ЗАКАЗОВ</span><strong>{orders.length}</strong></div><div><span>НОВЫЕ</span><strong>{orders.filter((order) => order.status === "new").length}</strong></div><span className="admin-updated">Обновлено: {lastUpdated ? formatDate(lastUpdated) : "—"} · автообновление 12 сек.</span></div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {orders.length === 0 ? <section className="admin-empty"><span>ЗАКАЗОВ ПОКА НЕТ</span><p>Новые заявки появятся здесь автоматически.</p></section> : <section className="admin-orders" aria-label="Список заказов">{orders.map((order) => <article className="admin-order" key={order.id}>
        <div className="admin-order-head"><div><span className="admin-order-id">#{order.id.slice(0, 8).toUpperCase()}</span><time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time></div><select aria-label={`Статус заказа ${order.id.slice(0, 8)}`} value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value as OrderStatus)}>{orderStatuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select></div>
        <div className="admin-order-grid"><section><span className="admin-section-label">КЛИЕНТ</span><strong>{order.customer.name}</strong><a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>{order.customer.email && <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>}</section><section><span className="admin-section-label">ДОСТАВКА</span><strong>{order.customer.city}</strong><span>{order.customer.address}</span>{order.customer.comment && <small>Комментарий: {order.customer.comment}</small>}</section><section><span className="admin-section-label">СВЯЗЬ</span><strong>{order.contactMethod}</strong><details><summary>Состав заказа · {order.items.reduce((sum, item) => sum + item.quantity, 0)} шт.</summary>{order.items.map((item) => <div className="admin-order-item" key={item.productId}><span>{item.name} × {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></div>)}</details></section></div>
        <div className="admin-order-total"><span>ИТОГО</span><strong>{formatPrice(order.total)}</strong></div>
      </article>)}</section>}
      <AdminReservations onUnauthorized={handleUnauthorized} />
    </main>
  );
}