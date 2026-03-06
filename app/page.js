"use client";
import { useState, useRef, useCallback } from "react";

const ACCENT = "#FF4D1C";
const ACCENT2 = "#FFB800";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0A0A0A;
    color: #F0EDE6;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  :root {
    --accent: #FF4D1C;
    --accent2: #FFB800;
    --bg: #0A0A0A;
    --surface: #141414;
    --surface2: #1E1E1E;
    --border: #2A2A2A;
    --text: #F0EDE6;
    --muted: #888;
  }

  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 100; opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  .app { max-width: 900px; margin: 0 auto; padding: 0 24px; }

  .header {
    padding: 40px 0 0;
    display: flex; align-items: flex-start; justify-content: space-between;
  }
  .logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; letter-spacing: 3px; color: var(--accent);
  }
  .badge {
    font-family: 'DM Mono', monospace; font-size: 11px;
    background: var(--surface2); border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 2px; color: var(--muted);
    letter-spacing: 1px;
  }

  .hero { padding: 60px 0 48px; }
  .hero-eyebrow {
    font-family: 'DM Mono', monospace; font-size:
