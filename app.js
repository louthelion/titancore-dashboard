(function () {
  // ===== Time format: FRI • JAN 09 2026 • 9:31 PM =====
  function fmtTime(d) {
    const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

    const day = days[d.getDay()];
    const mon = months[d.getMonth()];
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();

    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    const mm = String(d.getMinutes()).padStart(2, "0");

    return `${day} • ${mon} ${dd} ${yyyy} • ${h}:${mm} ${ampm}`;
  }

  // ===== Ensure a small time line exists on EVERY page =====
  function ensureTopTimeLine() {
    // Dashboard already has its own big hero layout; don’t inject extra.
    if (document.body.classList.contains("tcc-dashboard")) return;

    // If page already has a tcTime element, do nothing.
    if (document.getElementById("tcTime")) return;

    const top = document.createElement("div");
    top.className = "tc-topline";
    top.innerHTML = `
      <span class="tc-topline-label">System Time</span>
      <span class="tc-topline-value" id="tcTime">—</span>
    `;
    document.body.prepend(top);
  }

  // ===== A Mode: Inside pages = NO top menu, only Back button at bottom =====
  function applyInnerPageA() {
    // Only apply on non-dashboard pages
    if (document.body.classList.contains("tcc-dashboard")) return;

    // Hide any global menu/nav if it exists
    const nav = document.querySelector("nav.menu");
    if (nav) nav.style.display = "none";

    // Add small “Back to Dashboard” at bottom (only if not already present)
    if (document.querySelector(".tc-backdock")) return;

    const dock = document.createElement("div");
    dock.className = "tc-backdock";
    dock.innerHTML = `<a class="tc-backbtn" href="index.html">← Back to Dashboard</a>`;
    document.body.appendChild(dock);
  }

  // ===== Update time every second =====
  function tick() {
    const el = document.getElementById("tcTime");
    if (el) el.textContent = fmtTime(new Date());
  }

  // Run
  ensureTopTimeLine();
  applyInnerPageA();
  tick();
  setInterval(tick, 1000);
})();
