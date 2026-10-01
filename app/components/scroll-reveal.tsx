"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });

    function revealVisible() {
      document.querySelectorAll<HTMLElement>(".scroll-reveal:not(.is-revealed)").forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0) {
          element.classList.add("is-revealed");
          observer.unobserve(element);
        }
      });
    }

    function observe(container: ParentNode) {
      if (container instanceof HTMLElement && container.matches(".scroll-reveal")) observer.observe(container);
      container.querySelectorAll?.(".scroll-reveal").forEach((element) => observer.observe(element));
      revealVisible();
    }

    observe(document.body);
    window.addEventListener("scroll", revealVisible, { passive: true });
    window.addEventListener("resize", revealVisible);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) observe(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", revealVisible);
      window.removeEventListener("resize", revealVisible);
    };
  }, [pathname]);

  return null;
}