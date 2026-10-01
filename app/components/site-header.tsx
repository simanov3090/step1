"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { useCart } from "@/app/components/cart-provider";

export function SiteHeader() {
  const { count, setIsOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationPending = useRef(false);

  useEffect(() => {
    navigationPending.current = false;
    const header = document.querySelector(".site-header");
    header?.classList.remove("header-leaving");
    header?.classList.add("header-entering");
    const timeout = window.setTimeout(() => header?.classList.remove("header-entering"), 650);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function transitionTo(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(href, window.location.href);
    if (destination.pathname === pathname) {
      closeMenu();
      return;
    }
    event.preventDefault();
    if (navigationPending.current) return;
    closeMenu();
    navigationPending.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }
    document.querySelector("body > main")?.classList.add("page-leaving");
    document.querySelector(".site-header")?.classList.add("header-leaving");
    window.setTimeout(() => router.push(href), 280);
  }

  return (
    <header className="site-header">
      <Link href="/#top" className="wordmark" onClick={(event) => transitionTo(event, "/#top")} aria-label="Вкусно Суши — главная">
        <span>ВКУСНО</span><span>СУШИ</span>
      </Link>
      <button className="mobile-menu-toggle" type="button" aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav className={menuOpen ? "primary-nav nav-open" : "primary-nav"} aria-label="Главная навигация">
        <Link href="/#top" onClick={(event) => transitionTo(event, "/#top")}>Главная</Link>
        <Link href="/#catalog" onClick={(event) => transitionTo(event, "/#catalog")}>Каталог</Link>
        <Link href="/delivery" onClick={(event) => transitionTo(event, "/delivery")}>Доставка</Link>
        <Link href="/reservation" onClick={(event) => transitionTo(event, "/reservation")}>Столик</Link>
      </nav>
      <button className="header-cart" type="button" onClick={() => { setIsOpen(true); closeMenu(); }} aria-label={`Открыть корзину, товаров: ${count}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h2l2.1 10.1a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 1.9-1.4L21 9H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
        <span className="cart-label">Корзина</span><span className="cart-count">{count}</span>
      </button>
    </header>
  );
}