import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import AnimatedShaderBackground from "./components/ui/animated-shader-background";

/* =========================================================
   Hoverla — Premium Auto Service Landing
   ========================================================= */

// ---------- Reveal-on-scroll hook ----------
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- Section wrapper ----------
function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      <div className="reveal mb-12 max-w-3xl">
        {eyebrow && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-blink" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base text-[var(--text-1)] sm:text-lg">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

// ---------- Icon helpers (inline SVGs) ----------
const I = {
  Engine: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 10V7h3l2-2h6l2 2h3v3" />
      <rect x="3" y="10" width="18" height="8" rx="1.5" />
      <path d="M7 14h2M11 14h2M15 14h2" />
      <path d="M12 5V3M8 5V4M16 5V4" />
    </svg>
  ),
  Suspension: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="5" cy="18" r="3" /><circle cx="19" cy="18" r="3" />
      <path d="M8 18h8M3 12h18M6 12l3-6h6l3 6M9 9v3M15 9v3" />
    </svg>
  ),
  Tire: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </svg>
  ),
  Wash: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M4 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
      <path d="M9 8l1-3M15 8l-1-3M12 9V4" />
    </svg>
  ),
  Oil: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z" />
      <path d="M9 14h6" />
    </svg>
  ),
  Diag: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M7 10h2l2-3 2 6 2-3h2" />
      <path d="M8 20h8" />
    </svg>
  ),
  Phone: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  ),
  Pin: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z" />
      <circle cx="12" cy="9" r="3" />
    </svg>
  ),
  Clock: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  ),
  Telegram: (p: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M21.9 4.3 18.7 20a1.5 1.5 0 0 1-2.1 1.1l-5.2-3.9-2.6 2.5a.7.7 0 0 1-1.2-.4l-.5-5.4 10.3-9.4c.4-.4-.1-.6-.6-.3L3.9 11.7 1.2 10.8c-1.3-.4-1.3-1.3.3-1.9L19.9 2.7c.9-.3 1.7.2 2 1.6z" />
    </svg>
  ),
  Sun: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  Moon: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
  Check: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  ),
};

// ---------- Supercar outline SVG (Hero) ----------
function SupercarOutline() {
  return (
    <svg
      viewBox="0 0 800 280"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="carGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#1a73e8" />
        </linearGradient>
        <filter id="neon">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter="url(#neon)" stroke="url(#carGrad)">
        {/* Body */}
        <path d="M40 210 Q 80 180 150 170 L 240 145 Q 330 110 430 105 Q 560 102 640 140 L 720 170 Q 760 180 770 205 L 760 225 L 40 225 Z" />
        {/* Roof / window */}
        <path d="M250 150 Q 340 115 440 115 Q 530 115 590 140 L 560 160 Q 430 150 290 165 Z" />
        {/* Door line */}
        <path d="M300 160 L 310 215 M 470 150 L 475 215" />
        {/* Headlight */}
        <path d="M700 175 L 745 180" />
        <path d="M60 200 L 110 200" />
        {/* Ground reflection */}
        <path d="M20 245 L 780 245" strokeDasharray="4 10" opacity="0.4" />
      </g>
      {/* Wheels */}
      <g stroke="url(#carGrad)" filter="url(#neon)">
        <circle cx="200" cy="225" r="34" />
        <circle cx="200" cy="225" r="16" />
        <circle cx="600" cy="225" r="34" />
        <circle cx="600" cy="225" r="16" />
        <path d="M200 209 V 241 M 184 225 H 216 M 188 213 L 212 237 M 212 213 L 188 237" strokeWidth="1" />
        <path d="M600 209 V 241 M 584 225 H 616 M 588 213 L 612 237 M 612 213 L 588 237" strokeWidth="1" />
      </g>
    </svg>
  );
}

// ---------- Navbar ----------
function Navbar({ theme, toggleTheme }: { theme: "dark" | "light"; toggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["#services", "Послуги"],
    ["#calc", "Калькулятор"],
    ["#tracker", "Трекер"],
    ["#booking", "Запис"],
    ["#contacts", "Контакти"],
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
          scrolled ? "glass-strong shadow-[0_10px_40px_-10px_rgba(0,229,255,0.25)]" : "glass"
        }`}
      >
        <a href="#top" className="flex items-center gap-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-[var(--border-strong)]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label="Hoverla logo"
              className="h-full w-full object-cover"
              src="https://res.cloudinary.com/dnjtfoofz/video/upload/v1780433404/0602_2_jj8kco.mp4"
            />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-extrabold tracking-[0.2em]">ГОВЕРЛА</div>
            <div className="font-mono text-[10px] uppercase text-[var(--text-2)]">Auto · Tech · Lab</div>
          </div>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-3 py-2 text-sm text-[var(--text-1)] transition hover:bg-[var(--surface)] hover:text-[var(--text-0)]"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] transition hover:scale-105"
          >
            <div className="relative h-5 w-5">
              <I.Sun className={`absolute inset-0 h-5 w-5 text-amber-300 transition-all ${theme === "dark" ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`} />
              <I.Moon className={`absolute inset-0 h-5 w-5 text-[var(--accent)] transition-all ${theme === "dark" ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`} />
            </div>
          </button>
          <a
            href="#booking"
            className="hidden rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2 text-sm font-semibold text-[#001018] shadow-[0_0_20px_rgba(0,229,255,0.35)] transition hover:scale-105 md:inline-block"
          >
            Записатися
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border-strong)] md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-strong absolute left-4 right-4 top-[72px] z-40 rounded-2xl p-3 md:hidden">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-sm text-[var(--text-1)] hover:bg-[var(--surface)]"
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ---------- Hero ----------
function Hero() {
  return (
    <section id="top" className="relative min-h-screen overflow-hidden pt-40 pb-20 md:pt-48 md:pb-28">
      {/* Animated shader aurora background */}
      <AnimatedShaderBackground />

      {/* Grid background */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute -top-20 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.08] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8" style={{ zIndex: 2 }}>
        <div className="reveal grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-1 font-mono text-xs uppercase tracking-widest text-[var(--accent)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-blink" />
              Дрогобич · Львівська обл.
            </div>
            <h1 className="font-display text-[44px] font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Автосервіс{" "}
              <span className="neon-text">ГОВЕРЛА</span>
              <br />
              <span className="text-[var(--text-1)]">Вершина технологічного</span>
              <br />
              обслуговування
            </h1>
            <p className="mt-6 max-w-xl text-base text-[var(--text-1)] sm:text-lg">
              Мікро-хірургія двигунів, лазерна інженерія ходової, гідродетейлінг та інтелектуальна діагностика. Ми не ремонтуємо авто — ми повертаємо їм заводську досконалість.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#booking"
                className="animate-pulse-glow relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3.5 font-semibold text-[#001018] transition hover:scale-[1.02]"
              >
                <I.Check className="h-5 w-5" />
                Записатися на ТО
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3.5 font-semibold text-[var(--text-0)] transition hover:border-[var(--accent)]"
              >
                Послуги
                <span aria-hidden>→</span>
              </a>
            </div>

            {/* KPI row */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4">
              {[
                ["12+", "років на ринку"],
                ["24/7", "екстрені виклики"],
                ["98%", "клієнтів повертаються"],
              ].map(([v, l]) => (
                <div key={l} className="glass rounded-xl p-4">
                  <div className="font-display text-2xl font-extrabold text-[var(--accent)]">{v}</div>
                  <div className="mt-1 text-xs text-[var(--text-2)]">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Supercar visual */}
          <div className="relative">
            <div className="glass neon-border relative aspect-[4/3] overflow-hidden rounded-3xl p-6">
              <div className="absolute inset-0 grid-bg opacity-40" />
              {/* scan line */}
              <div className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[var(--accent)]/20 to-transparent animate-scan" />
              <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] uppercase text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-blink" /> LIVE · CYBER BAY 01
              </div>
              <div className="absolute right-4 top-4 font-mono text-[10px] uppercase text-[var(--text-2)]">MODEL · H-PEAK</div>
              <div className="absolute inset-x-0 bottom-0 top-10 flex items-center justify-center text-[var(--accent)]">
                <div className="animate-float w-[92%]">
                  <SupercarOutline />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase text-[var(--text-2)]">
                <span>CHASSIS · OK</span>
                <span>ENGINE · 312HP</span>
                <span>DIAG · CLEAR</span>
              </div>
            </div>
            {/* floating badges */}
            <div className="glass absolute -left-4 top-6 hidden rounded-xl px-3 py-2 text-xs sm:block">
              <div className="font-mono text-[10px] uppercase text-[var(--text-2)]">Torque</div>
              <div className="font-display text-lg font-bold">420 <span className="text-xs text-[var(--text-2)]">Nm</span></div>
            </div>
            <div className="glass absolute -right-4 bottom-8 hidden rounded-xl px-3 py-2 text-xs sm:block">
              <div className="font-mono text-[10px] uppercase text-[var(--text-2)]">0–100</div>
              <div className="font-display text-lg font-bold">3.8 <span className="text-xs text-[var(--text-2)]">s</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className="mt-16 overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]/40 py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-widest text-[var(--text-2)]">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              {[
                "OBD-II · CAN-Bus",
                "Laser Alignment",
                "Ceramic Coating",
                "Engine Rebuild",
                "EV Ready",
                "Premium Detailing",
                "Hydro Wash",
                "Tire Architecture",
              ].map((t) => (
                <span key={t} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Services (points 2–7) ----------
const services = [
  {
    id: "engine",
    icon: I.Engine,
    tag: "02",
    title: "Ремонт двигунів",
    sub: "Heart Surgery",
    text: "Ремонт двигунів будь-якої складності. Повертаємо заводську потужність за допомогою комп'ютерного моделювання процесів.",
    bullets: ["Капітальний ремонт ДВЗ", "Заміна ГРМ та ланцюгів", "Турбосервіс", "Чіп-тюнінг"],
  },
  {
    id: "suspension",
    icon: I.Suspension,
    tag: "03",
    title: "Інженерія ходової",
    sub: "Suspension Control",
    text: "Ремонт ходової частини. Ідеальна керованість на будь-яких дорогах Дрогобича та області.",
    bullets: ["3D-розвал-сходження", "Заміна важелів та сайлентів", "Амортизатори Bilstein/KYB", "Діагностика підшипників"],
  },
  {
    id: "tire",
    icon: I.Tire,
    tag: "04",
    title: "Шиномонтажний хаб",
    sub: "Tire Architecture",
    text: "Високоточний шиномонтаж, балансування та сезонне зберігання гуми в кліматичних умовах.",
    bullets: ["Балансування Hunter", "Ремонт Run-Flat", "Сезонне зберігання", "Підбір дисків"],
  },
  {
    id: "wash",
    icon: I.Wash,
    tag: "05",
    title: "Гідродетейлінг",
    sub: "Aqua Shield",
    text: "Безпечна, діелектрична мийка двигуна хімією преміум-класу — без ризику для електроніки.",
    bullets: ["Мийка мотору", "Керамічне покриття", "Хімчистка салону", "Полірування кузова"],
  },
  {
    id: "maint",
    icon: I.Oil,
    tag: "06",
    title: "Розумне планове ТО",
    sub: "Smart Maintenance",
    text: "Інтерактивний чекліст заміни масел, фільтрів та свічок — строго за допусками заводу.",
    bullets: ["Масло OEM допуск", "Фільтри Mann/Mahle", "Свічки NGK/Iridium", "Антифриз/G12+"],
  },
  {
    id: "diag",
    icon: I.Diag,
    tag: "07",
    title: "Електронна діагностика",
    sub: "Compute Diagnostics",
    text: "Сканування помилок OBD-II, CAN-Bus, адаптації та кодування модулів професійним обладнанням.",
    bullets: ["OBD-II / CAN / UDS", "Адаптації DSG", "Кодування модулів", "Читання crash-data"],
  },
];

function Services() {
  return (
    <Section
      id="services"
      eyebrow="Послуги · 6 напрямків"
      title={<>Шість <span className="neon-text">інженерних</span> вертикалей</>}
      subtitle="Від рентгену двигуна до лазерної геометрії ходової — кожна послуга виконується в окремому ізольованому боксі з контролем якості за стандартом ISO."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <div
            key={s.id}
            className="reveal group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* animated glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--accent)] opacity-0 blur-3xl transition duration-700 group-hover:opacity-30" />

            <div className="flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-2)] text-[var(--accent)]">
                <s.icon className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-2)]">/{s.tag}</span>
            </div>

            <h3 className="mt-5 font-display text-2xl font-bold leading-tight">{s.title}</h3>
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">{s.sub}</div>
            <p className="mt-3 text-sm text-[var(--text-1)]">{s.text}</p>

            <ul className="mt-4 space-y-1.5">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-xs text-[var(--text-1)]">
                  <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
                  {b}
                </li>
              ))}
            </ul>

            <a href="#booking" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
              Замовити <span aria-hidden>→</span>
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ---------- Calculator (point 8) ----------
const calcServices = [
  { key: "engine",  name: "Ремонт двигуна",        base: 4500, unit: "год", rate: 650 },
  { key: "susp",    name: "Ремонт ходової",         base: 2200, unit: "год", rate: 550 },
  { key: "tire",    name: "Шиномонтаж (4 колеса)",  base: 800,  unit: "год", rate: 0   },
  { key: "wash",    name: "Мийка двигуна",          base: 650,  unit: "год", rate: 0   },
  { key: "oil",     name: "Заміна масла + фільтр",  base: 450,  unit: "год", rate: 0   },
  { key: "diag",    name: "Електронна діагностика", base: 400,  unit: "год", rate: 0   },
];

function Calculator() {
  const [selected, setSelected] = useState<Record<string, boolean>>({ oil: true });
  const [hours, setHours] = useState(2);

  const totals = useMemo(() => {
    let cost = 0;
    let time = 0;
    calcServices.forEach((s) => {
      if (selected[s.key]) {
        cost += s.base + s.rate * hours;
        time += s.key === "oil" || s.key === "diag" ? 0.5 : 1;
      }
    });
    return { cost, time };
  }, [selected, hours]);

  const toggle = (k: string) => setSelected((p) => ({ ...p, [k]: !p[k] }));

  return (
    <Section
      id="calc"
      eyebrow="Ексклюзив · Smart-калькулятор"
      title={<>Фішка від себе: <span className="neon-text">миттєва вартість</span></>}
      subtitle="Замість нудного прайсу — інтерактивні перемикачі. Оберіть послуги і побачте ціну та час виконання за 0.1 секунди."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            {calcServices.map((s) => {
              const on = !!selected[s.key];
              return (
                <button
                  key={s.key}
                  onClick={() => toggle(s.key)}
                  className={`group relative flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                    on
                      ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)] bg-[var(--bg-2)]/60 hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div>
                    <div className="font-display text-sm font-semibold">{s.name}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-[var(--text-2)]">від {s.base} грн.</div>
                  </div>
                  <div className={`chk ${on ? "on" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* slider */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold">Обсяг робіт (годин)</label>
              <span className="font-mono text-sm text-[var(--accent)]">{hours} год</span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={hours}
              onChange={(e) => setHours(+e.target.value)}
              className="cyber"
            />
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase text-[var(--text-2)]">
              <span>1 год</span><span>8 год</span><span>16 год</span>
            </div>
          </div>
        </div>

        {/* result card */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-gradient-to-br from-[var(--bg-2)] via-[var(--bg-1)] to-[var(--bg-2)] p-8">
          <div className="pointer-events-none absolute -inset-10 opacity-40">
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] blur-[90px]" />
          </div>
          <div className="relative">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Результат</div>
            <div className="mt-2 font-display text-lg font-semibold">Орієнтовна вартість та час</div>

            <div className="mt-8">
              <div className="font-mono text-xs uppercase text-[var(--text-2)]">Вартість</div>
              <div className="mt-1 font-display text-5xl font-black tracking-tight">
                {totals.cost.toLocaleString("uk-UA")} <span className="text-2xl text-[var(--text-2)]">грн.</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="font-mono text-[10px] uppercase text-[var(--text-2)]">Час роботи</div>
                <div className="mt-1 font-display text-2xl font-bold">{totals.time} год</div>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="font-mono text-[10px] uppercase text-[var(--text-2)]">Послуг обрано</div>
                <div className="mt-1 font-display text-2xl font-bold">{Object.values(selected).filter(Boolean).length}</div>
              </div>
            </div>

            <a
              href="#booking"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3.5 font-semibold text-[#001018] transition hover:scale-[1.01]"
            >
              Забронювати за цією оцінкою →
            </a>
            <p className="mt-3 text-center text-xs text-[var(--text-2)]">
              * Остаточна вартість уточнюється після діагностики
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ---------- Maintenance (point 6 interactive) ----------
const maintPlan: Record<number, { item: string; km: number; price: number }[]> = {
  10: [
    { item: "Заміна моторного масла (5W-30)", km: 10000, price: 1800 },
    { item: "Масляний фільтр",                 km: 10000, price: 350 },
    { item: "Діагностика ходової",            km: 10000, price: 400 },
  ],
  30: [
    { item: "Повітряний фільтр",   km: 30000, price: 500 },
    { item: "Салонний фільтр",     km: 30000, price: 450 },
    { item: "Свічки запалювання",  km: 30000, price: 1200 },
  ],
  60: [
    { item: "Паливний фільтр",     km: 60000, price: 900 },
    { item: "Гальмівна рідина",    km: 60000, price: 800 },
    { item: "Ремінь генератора",   km: 60000, price: 1100 },
  ],
  100: [
    { item: "Ремінь/ланцюг ГРМ",   km: 100000, price: 5500 },
    { item: "Антифриз G12+",       km: 100000, price: 900 },
    { item: "Олива в КПП",         km: 100000, price: 2400 },
  ],
};

function Maintenance() {
  const [km, setKm] = useState<number>(10);
  const items = maintPlan[km] ?? [];
  const total = items.reduce((a, b) => a + b.price, 0);
  return (
    <Section
      id="maintenance"
      eyebrow="Планове ТО"
      title={<>Розумний <span className="neon-text">чекліст</span> за пробігом</>}
      subtitle="Оберіть ваш поточний пробіг — і система миттєво підсвітить, що саме варто замінити відповідно до регламенту заводу-виробника."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Оберіть пробіг</div>
          <div className="mt-3 flex items-end gap-2">
            <div className="font-display text-6xl font-black">{km}</div>
            <div className="pb-2 font-mono text-sm text-[var(--text-2)]">× 1 000 км</div>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={10}
            value={km}
            onChange={(e) => setKm(+e.target.value)}
            className="cyber mt-6"
          />
          <div className="mt-2 flex justify-between font-mono text-[10px] uppercase text-[var(--text-2)]">
            <span>10к</span><span>30к</span><span>60к</span><span>100к</span>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-2)]/60 p-4">
            <div className="font-mono text-[10px] uppercase text-[var(--text-2)]">Орієнтовно</div>
            <div className="mt-1 flex items-end justify-between">
              <div className="font-display text-3xl font-bold">{total.toLocaleString("uk-UA")} грн.</div>
              <div className="text-xs text-[var(--text-2)]">{items.length} пунктів</div>
            </div>
          </div>
        </div>

        <div className="glass overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <div className="font-display text-sm font-semibold">Регламент · {km} 000 км</div>
            <div className="font-mono text-[11px] uppercase text-[var(--accent)]">ACTIVE</div>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {items.map((it) => (
              <li key={it.item} className="flex items-center justify-between px-6 py-4 transition hover:bg-[var(--surface)]">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <I.Check className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{it.item}</div>
                    <div className="font-mono text-[11px] text-[var(--text-2)]">Регламент · {it.km.toLocaleString("uk-UA")} км</div>
                  </div>
                </div>
                <div className="font-display text-lg font-bold">{it.price} грн.</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

// ---------- Tracker (Live Garage) ----------
const mockTracker: Record<string, { car: string; step: number; service: string; eta: string }> = {
  "AA1234BC": { car: "BMW X5 2021", step: 2, service: "Шиномонтаж + Мийка мотору", eta: "18:40" },
  "AA5678BC": { car: "Audi Q7 2019", step: 3, service: "ТО-60 + Діагностика",       eta: "Готово" },
  "AA0001BC": { car: "Toyota Camry 2022", step: 1, service: "Ремонт ходової",       eta: "20:10" },
};
const steps = ["В черзі", "На підйомнику", "Обслуговується", "Готово до видачі"];

function Tracker() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<typeof mockTracker[string] | null | "none">(null);

  const search = () => {
    const key = plate.trim().toUpperCase().replace(/\s+/g, "");
    if (mockTracker[key]) setResult(mockTracker[key]);
    else setResult("none");
  };

  return (
    <Section
      id="tracker"
      eyebrow="Live Garage Tracker"
      title={<>Онлайн-черга <span className="neon-text">у реальному часі</span></>}
      subtitle="Як статус доставки піци, але для вашого авто. Введіть номерний знак — і побачите, на якому етапі зараз ваша машина."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent)]">Введіть номер авто</div>
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="AA1234BC"
            className="mt-3 w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-2)] px-4 py-4 font-mono text-2xl uppercase tracking-[0.3em] outline-none transition focus:border-[var(--accent)]"
          />
          <button
            onClick={search}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-3.5 font-semibold text-[#001018] transition hover:scale-[1.01]"
          >
            Знайти авто
          </button>
          <p className="mt-4 text-xs text-[var(--text-2)]">
            Демо-номери для тесту:{" "}
            <button onClick={() => setPlate("AA1234BC")} className="font-mono text-[var(--accent)]">AA1234BC</button>,{" "}
            <button onClick={() => setPlate("AA5678BC")} className="font-mono text-[var(--accent)]">AA5678BC</button>,{" "}
            <button onClick={() => setPlate("AA0001BC")} className="font-mono text-[var(--accent)]">AA0001BC</button>
          </p>
        </div>

        <div className="glass rounded-3xl p-6 sm:p-8">
          {!result && (
            <div className="grid h-full min-h-[260px] place-items-center text-center text-[var(--text-2)]">
              <div>
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--border)]">
                  <I.Diag className="h-7 w-7 text-[var(--accent)]" />
                </div>
                Очікуємо запит…
              </div>
            </div>
          )}
          {result === "none" && (
            <div className="grid h-full min-h-[260px] place-items-center text-center">
              <div>
                <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-red-500/15 text-red-400">!</div>
                Авто <span className="font-mono text-[var(--accent)]">{plate.toUpperCase()}</span> не знайдено у черзі
              </div>
            </div>
          )}
          {result && result !== "none" && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Автомобіль</div>
                  <div className="font-display text-2xl font-bold">{result.car}</div>
                </div>
                <div className="rounded-xl border border-[var(--border)] px-3 py-1.5 font-mono text-xs">
                  ETA · <span className="text-[var(--accent)]">{result.eta}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-[var(--text-1)]">{result.service}</div>

              <div className="relative mt-8">
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-[var(--border)]" />
                <div
                  className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-700"
                  style={{ width: `${(result.step / (steps.length - 1)) * 100}%`, boxShadow: "0 0 20px rgba(0,229,255,0.5)" }}
                />
                <ol className="relative flex justify-between">
                  {steps.map((s, idx) => {
                    const active = idx <= result.step;
                    return (
                      <li key={s} className="flex flex-col items-center gap-2 text-center">
                        <span
                          className={`grid h-9 w-9 place-items-center rounded-full border-2 font-mono text-xs transition ${
                            active
                              ? "border-[var(--accent)] bg-[var(--accent)] text-[#001018]"
                              : "border-[var(--border-strong)] bg-[var(--bg-1)] text-[var(--text-2)]"
                          }`}
                        >
                          {idx < result.step ? "✓" : idx + 1}
                        </span>
                        <span className={`max-w-[90px] text-[11px] ${active ? "text-[var(--text-0)]" : "text-[var(--text-2)]"}`}>{s}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

// ---------- Booking form with Telegram simulation ----------
function Booking() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    car: "",
    service: "Шиномонтаж",
    date: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  const serviceList = ["Шиномонтаж", "Ремонт двигуна", "Ремонт ходової", "Мийка двигуна", "Діагностика", "Планове ТО", "Детейлінг"];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.car || !form.date) return;
    setStatus("sending");

    const text =
`🚨 Новий запис на СТО "Говерла"!
👤 Клієнт: ${form.name} (${form.phone})
🚗 Авто: ${form.car}
🛠 Послуга: ${form.service}
📅 Дата: ${form.date}`;

    // --- Telegram Bot API integration ---
    const BOT_TOKEN = "8872679066:AAFUejNzp_wsucoMuulc3HDPIongabl3_Rs";
    const CHAT_ID = "5275128341";
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
      });
      
      if (!response.ok) {
        console.error("Telegram API error:", await response.text());
      }
      setStatus("ok");
      setForm({ name: "", phone: "", car: "", service: "Шиномонтаж", date: "" });
      setTimeout(() => setStatus("idle"), 4200);
    } catch {
      setStatus("err");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <Section
      id="booking"
      eyebrow="Telegram · Instant"
      title={<>Онлайн-запис за <span className="neon-text">0.1 секунди</span></>}
      subtitle="Заповніть форму — і менеджер отримає сповіщення в робочий Telegram-чат ще до того, як ви закриєте сторінку."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={submit} className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ім'я" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Олег Шевченко" />
            <Field label="Телефон" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+380 97 000 00 00" />
            <Field label="Авто (марка / модель)" value={form.car} onChange={(v) => setForm({ ...form, car: v })} placeholder="BMW X5" />
            <Field label="Дата і час" type="datetime-local" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-2)]">Послуга</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {serviceList.map((s) => {
                  const on = form.service === s;
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setForm({ ...form, service: s })}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        on
                          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--text-0)]"
                          : "border-[var(--border)] bg-[var(--bg-2)]/60 text-[var(--text-1)] hover:border-[var(--border-strong)]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-4 font-semibold text-[#001018] transition hover:scale-[1.01] disabled:opacity-70"
          >
            <I.Telegram className="h-5 w-5" />
            {status === "sending" ? "Надсилаємо в Telegram…" : "Надіслати запис"}
          </button>
          <p className="mt-3 text-center text-xs text-[var(--text-2)]">
            Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних.
          </p>
        </form>

        {/* preview card */}
        <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="absolute right-4 top-4 flex items-center gap-1 font-mono text-[10px] uppercase text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-blink" /> Preview
          </div>
          <div className="mb-3 font-mono text-[11px] uppercase text-[var(--text-2)]">Повідомлення менеджеру</div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-2)]/60 p-4 font-mono text-[13px] leading-relaxed">
            <div>🚨 Новий запис на СТО <span className="text-[var(--accent)]">"Говерла"</span>!</div>
            <div>👤 Клієнт: {form.name || <span className="text-[var(--text-2)]">—</span>} ({form.phone || <span className="text-[var(--text-2)]">—</span>})</div>
            <div>🚗 Авто: {form.car || <span className="text-[var(--text-2)]">—</span>}</div>
            <div>🛠 Послуга: {form.service}</div>
            <div>📅 Дата: {form.date ? new Date(form.date).toLocaleString("uk-UA") : <span className="text-[var(--text-2)]">—</span>}</div>
          </div>

          {/* success toast */}
          {status === "ok" && (
            <div className="mt-5 rounded-2xl border border-green-400/40 bg-green-400/10 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-green-300">
                <I.Check className="h-5 w-5" /> Успішно!
              </div>
              <div className="mt-1 text-green-200/80">Менеджер вже підтвердив ваш візит. Очікуйте дзвінка.</div>
            </div>
          )}
          {status === "err" && (
            <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300">
              Помилка мережі. Спробуйте ще раз або зателефонуйте нам напряму.
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--text-2)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-2)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]"
      />
    </div>
  );
}

// ---------- Contacts + Map ----------
function Contacts() {
  const open = (() => {
    const h = new Date().getHours();
    return h >= 8 && h < 20;
  })();

  return (
    <Section
      id="contacts"
      eyebrow="Локація · Дрогобич"
      title={<>Кібер-контакти <span className="neon-text">& карта</span></>}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid gap-4">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Статус боксу</div>
              <div className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${open ? "bg-green-400/15 text-green-300" : "bg-red-400/15 text-red-300"}`}>
                <span className={`h-2 w-2 rounded-full ${open ? "bg-green-400" : "bg-red-400"} animate-blink`} />
                {open ? "ВІДКРИТО" : "ЗАЧИНЕНО"}
              </div>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">Пн–Нд · 08:00 – 20:00</div>
          </div>

          <a href="tel:+380000000000" className="glass group flex items-center gap-4 rounded-3xl p-6 transition hover:border-[var(--accent)]">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <I.Phone className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Гаряча лінія</div>
              <div className="font-display text-xl font-bold">+38 (067) 000-00-00</div>
            </div>
            <span className="ml-auto text-[var(--accent)] opacity-0 transition group-hover:opacity-100">→</span>
          </a>

          <a href="https://t.me/hoverla_sto" className="glass group flex items-center gap-4 rounded-3xl p-6 transition hover:border-[var(--accent)]">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <I.Telegram className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Telegram-бот</div>
              <div className="font-display text-xl font-bold">@hoverla_sto</div>
            </div>
            <span className="ml-auto text-[var(--accent)] opacity-0 transition group-hover:opacity-100">→</span>
          </a>

          <div className="glass flex items-center gap-4 rounded-3xl p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <I.Pin className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Адреса</div>
              <div className="font-display text-lg font-bold">м. Дрогобич, вул. Самбірська, 77</div>
              <div className="text-xs text-[var(--text-2)]">Львівська область, 82100</div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="glass relative h-[460px] overflow-hidden rounded-3xl">
          <iframe
            title="Hoverla map"
            className="dark-map h-full w-full"
            src="https://www.google.com/maps?q=Дрогобич,+вулиця+Самбірська,+77&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="relative mt-10 border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl ring-1 ring-[var(--border-strong)]">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Hoverla logo"
                className="h-full w-full object-cover"
                src="https://res.cloudinary.com/dnjtfoofz/video/upload/v1780433404/0602_2_jj8kco.mp4"
              />
            </div>
            <div className="font-display text-sm font-extrabold tracking-[0.2em]">ГОВЕРЛА</div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-[var(--text-2)]">
            Преміальний автосервіс у Дрогобичі. Вершина технологічного обслуговування з 2014 року.
          </p>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Навігація</div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <li><a href="#services" className="hover:text-[var(--accent)]">Послуги</a></li>
            <li><a href="#calc" className="hover:text-[var(--accent)]">Калькулятор</a></li>
            <li><a href="#tracker" className="hover:text-[var(--accent)]">Трекер</a></li>
            <li><a href="#booking" className="hover:text-[var(--accent)]">Запис</a></li>
            <li><a href="#contacts" className="hover:text-[var(--accent)]">Контакти</a></li>
            <li><a href="#maintenance" className="hover:text-[var(--accent)]">ТО</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[11px] uppercase text-[var(--text-2)]">Зв'язок</div>
          <div className="mt-3 space-y-1 text-sm">
            <div>м. Дрогобич, вул. Самбірська, 77</div>
            <div>+38 (067) 000-00-00</div>
            <div>@hoverla_sto · Telegram</div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] py-5 text-center font-mono text-[11px] uppercase text-[var(--text-2)]">
        © {new Date().getFullYear()} Hoverla Auto · Tech · Lab — Crafted in Drohobych
      </div>
    </footer>
  );
}

// ---------- APP ----------
export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [flash, setFlash] = useState(false);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useReveal();

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("hoverla-theme")) as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("light", initial === "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem("hoverla-theme", next);
    setTheme(next);
    setFlash(true);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlash(false), 700);
  };

  return (
    <div className="relative min-h-screen text-[var(--text-0)]">
      {/* Subtle background image overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.07]"
        aria-hidden="true"
      >
        <img
          src="https://res.cloudinary.com/dnjtfoofz/image/upload/v1780443977/1_c64yei.png"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {flash && <div className="theme-flash" />}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Services />
        <Maintenance />
        <Calculator />
        <Tracker />
        <Booking />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}
