"use client";

import { PointerEvent } from "react";
import { menuPhoto } from "@/data/menu";

export function HeroScene() {
  function moveScene(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--move-x", `${x * 8}px`);
    event.currentTarget.style.setProperty("--move-y", `${y * 8}px`);
  }

  function resetScene(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--move-x", "0px");
    event.currentTarget.style.setProperty("--move-y", "0px");
  }

  return (
    <div className="hero-scene" onPointerMove={moveScene} onPointerLeave={resetScene} role="img" aria-label="Роллы урамаки на доске, тёплая предметная съёмка">
      <div className="scene-sushi" style={{ backgroundImage: `url("${menuPhoto("photo-1534604973900-c43ab4c2e0ab", 2000)}")` }} />
      <div className="scene-light" />
    </div>
  );
}