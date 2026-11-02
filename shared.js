// Side navigation: collapses on desktop, becomes an off-canvas drawer on small screens.
(() => {
  const app = document.querySelector(".app");
  const drawer = matchMedia("(max-width: 1024px)");
  const close = () => app.classList.remove("nav-open");

  document.querySelector(".menu-btn").addEventListener("click", () => {
    drawer.matches ? app.classList.add("nav-open") : app.classList.remove("nav-collapsed");
  });
  document.querySelector(".nav-collapse").addEventListener("click", () => {
    drawer.matches ? close() : app.classList.add("nav-collapsed");
  });
  document.querySelector(".nav-scrim").addEventListener("click", close);
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  drawer.addEventListener("change", close);
})();

// Tooltips: any element with data-tip shows a tooltip above it on hover/focus.
(() => {
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  tip.innerHTML = '<div class="tip-body"></div><img class="tip-arrow" src="assets/tooltip-arrow.svg" alt="">';
  document.body.appendChild(tip);
  const body = tip.firstElementChild, arrow = tip.lastElementChild;

  function show(trigger) {
    body.textContent = trigger.dataset.tip;
    const r = trigger.getBoundingClientRect();
    const w = tip.offsetWidth, margin = 8;
    const center = r.left + r.width / 2;
    const left = Math.max(margin, Math.min(center - w / 2, document.documentElement.clientWidth - w - margin));
    tip.style.left = left + "px";
    tip.style.top = (r.top - tip.offsetHeight - 8) + "px";
    arrow.style.left = (center - left - 8) + "px";
    tip.classList.add("show");
  }
  const hide = () => tip.classList.remove("show");
  const triggerOf = e => e.target.closest?.("[data-tip]");
  document.addEventListener("mouseover", e => { const t = triggerOf(e); if (t) show(t); });
  document.addEventListener("mouseout", e => { const t = triggerOf(e); if (t && !t.contains(e.relatedTarget)) hide(); });
  document.addEventListener("focusin", e => { const t = triggerOf(e); if (t) show(t); });
  document.addEventListener("focusout", e => { if (triggerOf(e)) hide(); });
  window.addEventListener("scroll", hide, { passive: true, capture: true });
})();

// Toast: short confirmation pill near the bottom of the viewport.
window.toast = (() => {
  let el, timer;
  return msg => {
    if (!el) {
      el = document.createElement("div");
      el.className = "toast"; el.setAttribute("role", "status");
      document.body.append(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add("show"));
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove("show"), 3000);
  };
})();

// Modals: close on backdrop click or any [data-close] control.
document.querySelectorAll("dialog").forEach(d => {
  d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
});
