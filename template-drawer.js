// Template detail drawer ("Template name" side panel), shared by Step 1 and Step 2.
// Injects its markup on load and exposes window.openTemplateDrawer(template).
(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const METHOD_DETAIL = { "Dual reporting": "Market & location based", "Location based": "Location based" };
  const SOURCES = ["WITH CONTROL ON THE SOURCES", "WITHOUT CONTROL ON THE SOURCES"];
  const ARCHITECTURE = [
    { name: "Energy consumption", color: "#f9a964", large: true, lmb: true, children: [
      { name: "Cooling systems on site", children: SOURCES },
      { name: "Fuel on site", children: SOURCES },
      { name: "Green electricity on site", children: SOURCES }
    ] },
    { name: "Mobility", color: "#71d0cb" },
    { name: "Logistics", color: "#cf7172" },
    { name: "Products and services", color: "#2836c9" },
    { name: "Waste", color: "#4ec47e" },
    { name: "Capital goods", color: "#ba4ec4" },
    { name: "Sold products", color: "#4e8cc4" },
    { name: "Other", color: "#294966" }
  ];

  document.body.insertAdjacentHTML("beforeend", `
<dialog class="drawer" id="templateDrawer" aria-labelledby="drawerTitle">
  <div class="drawer-head">
    <div class="drawer-title">
      <h2 id="drawerTitle">Template name</h2>
      <button class="drawer-close" data-close aria-label="Close template details"><img src="assets/x-close.svg" alt=""></button>
    </div>
    <p>Detail view of the selected template.</p>
  </div>
  <div class="drawer-body">
    <section class="drawer-section" id="generalPanel">
      <h3><button class="collapse-btn" aria-expanded="true" aria-controls="infoBody">General information<img class="icon-16" src="assets/ov-chevron-title.svg" alt=""></button></h3>
      <div class="info-body" id="infoBody">
        <div class="info-sub">
          <dl class="info-items">
            <div><dt>Author</dt><dd id="dAuthor"></dd></div>
            <div><dt>Entity</dt><dd id="dEntity"></dd></div>
            <div><dt>Reference protocol <span class="tip-trigger" tabindex="0" data-tip="Indicates the protocol on which the template is based, such as Bilan Carbone or GHG. Templates can be customized to fit specific reporting structures while still referencing these standard protocols." aria-label="About reference protocol"><img class="icon-16" src="assets/ov-info-circle.svg" alt=""></span></dt><dd id="dProtocol"></dd></div>
            <div><dt>Reporting method</dt><dd id="dMethod"></dd></div>
          </dl>
        </div>
        <div class="info-sub">
          <h4>Description</h4>
          <p>Lorem ipsum dolor sit amet. Ab illo incidunt ad optio nisi et odio expedita qui ipsa soluta. Ut dignissimos dolores non molestiae minus aut sapiente enim non similique repellat et magni veritatis non quas maxime est eligendi dolores.</p>
        </div>
      </div>
    </section>

    <section class="drawer-section">
      <h3>Report architecture</h3>
      <div class="arch">
        <div class="arch-row arch-head">
          <div>Sections</div>
          <div>LMB split <img class="icon-16" src="assets/ov-help-circle.svg" alt=""></div>
          <div>Operation</div>
          <div>Excluded <img class="icon-16" src="assets/ov-help-circle.svg" alt=""></div>
        </div>
        <div id="archRows"></div>
      </div>
    </section>
  </div>
</dialog>`);

  const expanded = new Set(["Energy consumption", "Energy consumption/Cooling systems on site"]);
  const check = on => `<span class="dis-check ${on ? "on" : ""}" role="img" aria-label="${on ? "Yes" : "No"}"></span>`;
  function archRows() {
    const out = [];
    ARCHITECTURE.forEach(cat => {
      const catOpen = expanded.has(cat.name);
      const toggle = cat.children
        ? `<button class="arch-toggle" data-toggle="${esc(cat.name)}" aria-expanded="${catOpen}" aria-label="Toggle ${esc(cat.name)}"><img class="icon-16" src="assets/ov-chevron.svg" alt=""></button>`
        : `<span class="arch-toggle static" aria-hidden="true"><img class="icon-16" src="assets/ov-chevron.svg" alt=""></span>`;
      out.push(`<div class="arch-row lvl-0 ${catOpen ? "expanded" : ""}"><div>${toggle}<span class="arch-dot ${cat.large ? "lg" : ""}" style="background:${cat.color}"></span><span class="arch-name">${esc(cat.name)}</span></div><div>${check(cat.lmb)}</div><div>${check(false)}</div><div>${check(false)}</div></div>`);
      if (!catOpen || !cat.children) return;
      cat.children.forEach(sub => {
        const key = `${cat.name}/${sub.name}`, subOpen = expanded.has(key);
        out.push(`<div class="arch-row lvl-1 ${subOpen ? "expanded open-sub" : ""}"><div><button class="arch-toggle" data-toggle="${esc(key)}" aria-expanded="${subOpen}" aria-label="Toggle ${esc(sub.name)}"><img class="icon-16" src="assets/ov-chevron.svg" alt=""></button><span class="arch-name">${esc(sub.name)}</span></div><div>${check(cat.lmb)}</div><div>${check(false)}</div><div>${check(false)}</div></div>`);
        if (subOpen) sub.children.forEach(leaf =>
          out.push(`<div class="arch-row lvl-2"><div><span class="arch-name">${esc(leaf)}</span></div><div>${check(cat.lmb)}</div><div>${check(false)}</div><div>${check(false)}</div></div>`));
      });
    });
    $("#archRows").innerHTML = out.join("");
  }
  $("#archRows").addEventListener("click", e => {
    const t = e.target.closest("[data-toggle]");
    if (!t) return;
    const k = t.dataset.toggle;
    expanded.has(k) ? expanded.delete(k) : expanded.add(k);
    archRows();
    $(`[data-toggle="${CSS.escape(k)}"]`)?.focus();
  });
  $(".collapse-btn").addEventListener("click", e => {
    const collapsed = $("#generalPanel").classList.toggle("collapsed");
    e.currentTarget.setAttribute("aria-expanded", !collapsed);
  });
  window.openTemplateDrawer = t => {
    $("#drawerTitle").textContent = t.name;
    $("#dAuthor").textContent = t.author;
    $("#dEntity").textContent = t.entity;
    $("#dProtocol").textContent = t.protocol;
    $("#dMethod").textContent = METHOD_DETAIL[t.method] || t.method;
    archRows();
    $("#templateDrawer").showModal();
  };
})();
