"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#63298c", "#511f73", "#b489c9", "#63298c", "#511f73"];
const PIECE_COUNT = 72;
const DURATION_MS = 3200;

/**
 * One short fall of paper when a payment first becomes PAID.
 * The canvas does not receive clicks, so the buttons underneath stay usable.
 */
export default function OrderConfetti({ orderId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const storageKey = `annchloe-confetti:${orderId}`;
    try {
      if (sessionStorage.getItem(storageKey)) return undefined;
    } catch {
      // Private mode can block storage. This visit can still celebrate.
    }

    const pieces = createPieces(window.innerWidth);
    let frame = 0;
    let finished = false;
    const started = performance.now();

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function tick(now) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const elapsed = now - started;
      context.clearRect(0, 0, width, height);
      context.globalAlpha = elapsed > DURATION_MS - 700
        ? Math.max(0, (DURATION_MS - elapsed) / 700)
        : 1;

      for (const piece of pieces) {
        piece.vy += 0.06;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.spin;
        drawPiece(context, piece);
      }

      if (elapsed < DURATION_MS) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      finished = true;
      rememberPlayed(storageKey);
    }

    resize();
    window.addEventListener("resize", resize);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      // Dev Strict Mode cleans this up once before the animation ends.
      // Remembering only a finished burst lets that second run still play.
      if (finished) rememberPlayed(storageKey);
    };
  }, [orderId]);

  return <canvas ref={canvasRef} className="order-confetti" aria-hidden="true" />;
}

function createPieces(width) {
  return Array.from({ length: PIECE_COUNT }, (_, index) => {
    const fromLeft = index % 2 === 0;
    return {
      x: (fromLeft ? width * 0.18 : width * 0.82) + (Math.random() - 0.5) * 28,
      y: -16 - Math.random() * 140,
      vx: (fromLeft ? 1 : -1) * (0.6 + Math.random() * 2.2),
      vy: 1.2 + Math.random() * 2.2,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.18,
      w: 7 + Math.random() * 5,
      h: 10 + Math.random() * 8,
      color: COLORS[index % COLORS.length],
    };
  });
}

function drawPiece(context, piece) {
  context.save();
  context.translate(piece.x, piece.y);
  context.rotate(piece.rotation);
  context.fillStyle = piece.color;
  context.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
  context.restore();
}

function rememberPlayed(storageKey) {
  try {
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // Ignore. The burst already happened.
  }
}
