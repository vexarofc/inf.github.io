import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberAlphabet() {
  const TERMS = useMemo(() => [
    {
      id: "phishing",
      term: "Фішинг",
      category: "threat",
      preview: "Шахрайство, що імітує легітимні служби, щоб вкрасти дані.",
      definition:
        "Фішинг — це вид шахрайства, у якому зловмисники під виглядом довірених сервісів підмальовують листи або сайти, щоб змусити жертву віддати логіни, паролі або фінансові дані. Зазвичай використовують електронну пошту, повідомлення або підроблені веб‑сторінки.",
      links: [
        {
          name: "Офіс Кіберполіції — поради щодо фішингу",
          url: "https://cyberpolice.gov.ua/",
          desc: "Офіційні рекомендації та приклади шахрайських листів.",
        },
      ],
      // simple SVG illustration as JSX
      svg: (
        <svg viewBox="0 0 120 80" className="w-24 h-16" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="112" height="56" rx="6" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.12" />
          <path d="M12 24h96M12 44h64" stroke="currentColor" strokeWidth="1.8" opacity="0.18" />
          <g transform="translate(20,34)">
            <path d="M0 0c6-6 12-6 18 0" stroke="currentColor" strokeWidth="2" fill="none" />
            <rect x="8" y="-10" width="44" height="20" rx="3" fill="currentColor" opacity="0.06" />
          </g>
          <text x="10" y="20" fontSize="7" fill="currentColor" opacity="0.25">e‑mail</text>
        </svg>
      ),
    },
    {
      id: "firewall",
      term: "Мережевий екран (Firewall)",
      category: "protection",
      preview: "Система, що контролює трафік між мережами.",
      definition:
        "Firewall — пристрій або програмне забезпечення, що фільтрує мережевий трафік згідно з правилами безпеки. Допомагає блокувати несанкціонований доступ і зменшує ризик атак.",
      links: [
        {
          name: "Основи мережевої безпеки — стаття",
          url: "https://example.com/network-security",
          desc: "Коротко про фаєрволи й правила фільтрації.",
        },
      ],
      svg: (
        <svg viewBox="0 0 120 80" className="w-24 h-16" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="8" width="104" height="64" rx="10" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.12" />
          <path d="M20 40c8-14 32-22 64-8" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2" />
          <circle cx="40" cy="44" r="10" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.16" />
        </svg>
      ),
    },
    {
      id: "2fa",
      term: "Двофакторна автентифікація (2FA)",
      category: "protection",
      preview: "Додатковий рівень захисту: пароль + ще один код.",
      definition:
        "2FA — це метод підтвердження особи, коли крім пароля потрібен ще один фактор (наприклад, код у SMS або додатку-генераторі), що значно ускладнює злому облікового запису.",
      links: [
        {
          name: "Google — Налаштування 2FA",
          url: "https://support.google.com/",
          desc: "Інструкція як увімкнути 2FA для сервісів Google (приклад).",
        },
      ],
      svg: (
        <svg viewBox="0 0 120 80" className="w-24 h-16" xmlns="http://www.w3.org/2000/svg">
          <rect x="14" y="18" width="28" height="36" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.12" />
          <rect x="64" y="20" width="36" height="32" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.12" />
          <path d="M28 30v14" stroke="currentColor" strokeWidth="2" opacity="0.18" />
          <circle cx="82" cy="36" r="4" fill="currentColor" opacity="0.18" />
        </svg>
      ),
    },
    // Add more terms as needed
  ], []);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    return TERMS.filter((t) => {
      const matchesQuery = [t.term, t.preview, t.definition]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCat = category === "all" ? true : t.category === category;
      return matchesQuery && matchesCat;
    });
  }, [TERMS, query, category]);

  useEffect(() => {
    // Reset focus when list changes
    setFocusedIndex(0);
  }, [query, category]);

  useEffect(() => {
    function onKey(e) {
      if (selected) {
        if (e.key === "Escape") setSelected(null);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((i) => {
          const next = Math.min(i + 1, filtered.length - 1);
          scrollIntoView(next);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((i) => {
          const next = Math.max(i - 1, 0);
          scrollIntoView(next);
          return next;
        });
      } else if (e.key === "Enter") {
        const item = filtered[focusedIndex];
        if (item) setSelected(item);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered, focusedIndex, selected]);

  function scrollIntoView(index) {
    const container = listRef.current;
    if (!container) return;
    const child = container.querySelectorAll(".term-item")[index];
    if (child) child.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-12">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar — list */}
          <aside className="w-full md:w-1/3 border-r border-gray-100 p-5">
            <h1 className="text-2xl font-semibold mb-2">Абетка з кібербезпеки</h1>
            <p className="text-sm text-gray-500 mb-4">Виберіть термін, щоб дізнатися більше.</p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  aria-label="Пошук термінів"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Пошук... (наприклад: фішинг, 2FA)"
                />
                <div className="absolute right-2 top-2 text-xs text-gray-400">⌘K</div>
              </div>

              <div className="flex gap-2 text-sm">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:outline-none"
                >
                  <option value="all">Усі</option>
                  <option value="threat">Загрози</option>
                  <option value="protection">Захист</option>
                  <option value="networks">Мережі</option>
                </select>

                <button
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                  className="px-3 py-1 rounded-lg border border-gray-200 text-sm"
                >
                  Скинути
                </button>
              </div>
            </div>

            <div ref={listRef} className="mt-4 max-h-[60vh] overflow-auto pr-2">
              <ul className="space-y-2">
                {filtered.map((t, i) => (
                  <li
                    key={t.id}
                    className={`term-item flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all transform hover:scale-[1.01] hover:shadow-sm ${
                      i === focusedIndex ? "ring-2 ring-indigo-100 bg-indigo-50" : ""
                    }`}
                    onClick={() => setSelected(t)}
                    onMouseEnter={() => setFocusedIndex(i)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-12 h-12 flex items-center justify-center text-indigo-600">
                      {/* mini illustration */}
                      <div className="w-10 h-8">{t.svg}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{t.term}</div>
                        <div className="text-xs text-gray-400 ml-2">{t.category}</div>
                      </div>
                      <div className="text-sm text-gray-500">{t.preview}</div>
                    </div>
                  </li>
                ))}

                {filtered.length === 0 && (
                  <li className="text-sm text-gray-500 p-3">Нічого не знайдено.</li>
                )}
              </ul>
            </div>

            <div className="mt-4 text-xs text-gray-400">Підтримується клавіатурна навігація: ↑ ↓ Enter. Esc — закрити термін.</div>
          </aside>

          {/* Content area */}
          <main className="w-full md:w-2/3 p-6 relative">
            <AnimatePresence initial={false} mode="wait">
              {selected ? (
                <motion.section
                  key={selected.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-28 h-20 flex items-center justify-center text-indigo-600 rounded-lg bg-indigo-50/40 p-2">
                      {selected.svg}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">{selected.term}</h2>
                      <p className="text-sm text-gray-500">Категорія: {selected.category}</p>
                    </div>
                    <div className="ml-auto">
                      <button
                        onClick={() => setSelected(null)}
                        className="text-sm px-3 py-1 rounded-lg border border-gray-200"
                        aria-label="Закрити"
                      >
                        Закрити
                      </button>
                    </div>
                  </div>

                  <div className="prose max-w-none text-gray-700">
                    <p>{selected.definition}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-gray-100 p-4 bg-white shadow-sm">
                      <h3 className="font-medium">Ілюстрація</h3>
                      <div className="mt-3">{selected.svg}</div>
                      <p className="text-xs text-gray-400 mt-2">Схематична ілюстрація для пояснення терміну.</p>
                    </div>

                    <div className="rounded-lg border border-gray-100 p-4 bg-white shadow-sm">
                      <h3 className="font-medium">Дізнатися більше</h3>
                      <ul className="mt-3 space-y-3">
                        {selected.links.map((l) => (
                          <li key={l.url} className="text-sm">
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="font-medium hover:underline"
                            >
                              {l.name}
                            </a>
                            <div className="text-xs text-gray-500">{l.desc}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center justify-center h-full text-center text-gray-400"
                >
                  <div className="mb-4">
                    <svg width="120" height="90" viewBox="0 0 120 90" className="mx-auto text-indigo-400" xmlns="http://www.w3.org/2000/svg">
                      <rect x="6" y="10" width="108" height="70" rx="12" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.12" />
                      <path d="M22 44h76" stroke="currentColor" strokeWidth="1.6" opacity="0.18" />
                    </svg>
                  </div>
                  <div className="max-w-xl">
                    <h3 className="text-lg font-medium">Оберіть термін зліва</h3>
                    <p className="mt-2">Тут з'явиться детальне пояснення, ілюстрація та корисні посилання.</p>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* subtle footer */}
            <div className="absolute left-6 right-6 bottom-6 text-xs text-gray-400 flex justify-between">
              <div>Дизайн: мінімалістичний • Плавні анімації</div>
              <div>Версія демо</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
