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
