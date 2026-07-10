const header = document.querySelector("[data-header]");
const lightSwitch = document.querySelector("[data-light-switch]");
const lightMini = document.querySelector("[data-light-mini]");
const sceneFrame = document.querySelector("[data-scene-frame]");
const sceneButtons = document.querySelectorAll("[data-scene]");
const sceneTitle = document.querySelector("[data-scene-title]");
const sceneText = document.querySelector("[data-scene-text]");
const quoteForm = document.querySelector("[data-quote-form]");
const quoteResult = document.querySelector("[data-quote-result]");
const quoteTotal = document.querySelector("[data-quote-total]");

const scenes = {
  day: {
    title: "Дневной режим",
    text: "Ровный нейтральный свет для бытовых задач и работы.",
  },
  evening: {
    title: "Вечерний режим",
    text: "Тёплая подсветка делает комнату мягче и уютнее.",
  },
  accent: {
    title: "Акцентный режим",
    text: "Контур и треки подчёркивают архитектуру комнаты.",
  },
};

const formatMoney = (value) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

/* --- выключатель света --- */
const setLights = (on) => {
  document.body.dataset.lights = on ? "on" : "off";
  lightSwitch?.setAttribute("aria-checked", String(on));
};

lightSwitch?.addEventListener("click", () => {
  setLights(document.body.dataset.lights === "off");
});

lightMini?.addEventListener("click", () => setLights(true));

/* --- шапка при скролле --- */
const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

/* --- сценарии света --- */
sceneFrame?.setAttribute("data-mode", "day");

sceneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.scene;
    const copy = scenes[mode];

    sceneButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    sceneFrame?.setAttribute("data-mode", mode);
    if (sceneTitle && copy) sceneTitle.textContent = copy.title;
    if (sceneText && copy) sceneText.textContent = copy.text;
  });
});

/* --- калькулятор с плавным набором суммы --- */
let currentTotal = 58800;

const animateTotal = (target) => {
  if (!quoteTotal) return;
  const from = currentTotal;
  const duration = 700;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round((from + (target - from) * eased) / 100) * 100;
    quoteTotal.textContent = `от ${formatMoney(value)}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
  currentTotal = target;
};

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(quoteForm);
  const area = Math.max(Number(data.get("area")) || 0, 5);
  const rooms = Math.max(Number(data.get("rooms")) || 1, 1);
  const light = data.get("light");

  const lightRate = {
    base: 1550,
    line: 2450,
    track: 3100,
    smart: 3900,
  }[light] || 2450;

  const base = area * 1450;
  const lightCost = area * lightRate;
  const roomComplexity = rooms * 6200;
  const total = Math.round((base + lightCost + roomComplexity) / 100) * 100;

  animateTotal(total);

  if (quoteResult) {
    quoteResult.classList.remove("is-flash");
    void quoteResult.offsetWidth;
    quoteResult.classList.add("is-flash");
  }
});

/* --- появление блоков при скролле --- */
document
  .querySelectorAll(".section-head, .solution-card, .work-card, .step, .scene-copy, .scene-frame, .showroom-image, .showroom-copy, .process-copy, .process-image, .request-card")
  .forEach((node) => {
    node.setAttribute("data-reveal", "");
  });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll("[data-reveal]").forEach((node) => revealObserver.observe(node));

if (window.lucide) {
  window.lucide.createIcons();
}
