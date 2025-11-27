(function () {
  "use strict";

  const THEME_STORAGE_KEY = "echoscribe-theme";
  const NAV_BREAKPOINT = window.matchMedia("(min-width: 900px)");
  const MOBILE_NAV = window.matchMedia("(max-width: 899px)");
  const doc = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function mediaDark() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function effectiveTheme() {
    const v = doc.getAttribute("data-theme");
    if (v === "light" || v === "dark") return v;
    return mediaDark() ? "dark" : "light";
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") doc.setAttribute("data-theme", stored);
    else doc.removeAttribute("data-theme");
  }

  function toggleTheme() {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    doc.setAttribute("data-theme", next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  initTheme();

  const header = document.querySelector("[data-header]");
  function onScroll() {
    const y = window.scrollY || doc.scrollTop;
    if (header) header.classList.toggle("is-scrolled", y > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLabel = navToggle?.querySelector(".sr-only");

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    if (navLabel) navLabel.textContent = open ? "Close menu" : "Open menu";
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => setNavOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => {
      if (e.target.closest('a[href^="#"]') && MOBILE_NAV.matches) setNavOpen(false);
    });
    window.addEventListener("resize", () => {
      if (NAV_BREAKPOINT.matches) setNavOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setNavOpen(false);
    });
  }

  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (revealNodes.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealNodes.forEach((el) => io.observe(el));
    } else {
      revealNodes.forEach((el) => el.classList.add("is-visible"));
    }
  }

  const FAQ_ITEMS = [
    {
      q: "Does it support Zoom or uploaded files?",
      a: "Yes. Connect Zoom cloud recordings or Google Meet exports, or upload audio and video files directly. Live capture is available on Pro and Team.",
    },
    {
      q: "Can I edit summaries?",
      a: "Everything is editable. Changes sync to your team view, and the transcript keeps deep links so you can verify wording anytime.",
    },
    {
      q: "Is there a free plan?",
      a: "Starter is free with a monthly transcription allowance—enough to prove value on a handful of calls. Upgrade when you need longer retention and connectors.",
    },
    {
      q: "Is my data private?",
      a: "Files are encrypted in transit and at rest. We never train on your workspace content. Team plans include export and deletion workflows for compliance reviews.",
    },
    {
      q: "Can I export to PDF or Notion?",
      a: "Pro and Team include polished PDF exports and a Notion push that preserves headings, action tables, and links back to EchoScribe.",
    },
    {
      q: "Does it work for solo users?",
      a: "Absolutely. Many customers run EchoScribe solo for client calls and voice notes, then invite collaborators only when a project needs shared visibility.",
    },
  ];

  const faqRoot = document.getElementById("faq-accordion");
  if (faqRoot) {
    FAQ_ITEMS.forEach((item, i) => {
      const n = i + 1;
      const btnId = `faq-btn-${n}`;
      const panelId = `faq-panel-${n}`;

      const wrap = document.createElement("div");
      wrap.className = "accordion-item";

      const h3 = document.createElement("h3");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "accordion-trigger";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("data-accordion-btn", "");
      btn.id = btnId;
      btn.setAttribute("aria-controls", panelId);
      btn.appendChild(document.createTextNode(item.q));
      const icon = document.createElement("span");
      icon.className = "accordion-icon";
      icon.setAttribute("aria-hidden", "true");
      btn.appendChild(icon);
      h3.appendChild(btn);

      const panel = document.createElement("div");
      panel.className = "accordion-panel";
      panel.id = panelId;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", btnId);
      panel.hidden = true;
      const p = document.createElement("p");
      p.textContent = item.a;
      panel.appendChild(p);

      wrap.appendChild(h3);
      wrap.appendChild(panel);
      faqRoot.appendChild(wrap);
    });

    faqRoot.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-accordion-btn]");
      if (!btn || !faqRoot.contains(btn)) return;

      const expanded = btn.getAttribute("aria-expanded") === "true";
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      faqRoot.querySelectorAll("[data-accordion-btn]").forEach((other) => {
        if (other === btn) return;
        other.setAttribute("aria-expanded", "false");
        const oid = other.getAttribute("aria-controls");
        const op = oid ? document.getElementById(oid) : null;
        if (op) op.hidden = true;
      });

      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (panel) panel.hidden = expanded;
    });
  }

  function formatInt(n) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  }

  const counterEl = document.querySelector("[data-counter]");
  if (counterEl && !prefersReducedMotion.matches) {
    const target = Number.parseInt(counterEl.getAttribute("data-counter"), 10);
    if (!Number.isNaN(target)) {
      const start = Math.max(0, Math.floor(target * 0.82));
      const duration = 1100;
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - (1 - p) ** 3;
        counterEl.textContent = `${formatInt(Math.round(start + (target - start) * eased))}+`;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const SECTION_IDS = ["features", "how", "reviews", "pricing", "faq"];
  const navLinks = document.querySelectorAll("[data-nav-link]");
  if ("IntersectionObserver" in window && navLinks.length) {
    const ratios = new Map(SECTION_IDS.map((id) => [id, 0]));
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id) ratios.set(entry.target.id, entry.intersectionRatio);
        });
        let bestId = null;
        let best = 0;
        ratios.forEach((r, id) => {
          if (r > best) {
            best = r;
            bestId = id;
          }
        });
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          const id = href?.startsWith("#") ? href.slice(1) : "";
          link.classList.toggle("is-active", id === bestId && best > 0.12);
        });
      },
      { rootMargin: "-18% 0px -52% 0px", threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) navObserver.observe(el);
    });
  }
