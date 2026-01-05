(function () {
  // CLOCK
  function tick() {
    const now = new Date();
    const dt = now.toLocaleString(undefined, { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const el = document.getElementById("tcDateTime");
    if (el) el.textContent = dt;
  }
  tick();
  setInterval(tick, 1000);

  // ACTIVE toggle
  const MODE_KEY = "tc_mode";
  const btn = document.getElementById("tcModeBtn");
  function renderMode() {
    const mode = localStorage.getItem(MODE_KEY) || "ACTIVE";
    if (btn) btn.textContent = mode;
  }
  renderMode();
  if (btn) {
    btn.addEventListener("click", () => {
      const current = localStorage.getItem(MODE_KEY) || "ACTIVE";
      const next = current === "ACTIVE" ? "PAUSED" : "ACTIVE";
      localStorage.setItem(MODE_KEY, next);
      renderMode();
    });
  }

  // METRICS (demo numbers)
  const setText = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  setText("mAgentsActive", "4");
  setText("mTasks", "12");
  setText("mCompleted", "7");
  setText("mExceptions", "1");

  // TABS
  const tabButtons = document.querySelectorAll(".tabbtn");
  const panels = {
    taskboard: document.getElementById("tab-taskboard"),
    registry: document.getElementById("tab-registry"),
    automations: document.getElementById("tab-automations"),
    audit: document.getElementById("tab-audit"),
    system: document.getElementById("tab-system"),
  };

  function openTab(key) {
    tabButtons.forEach(b => b.classList.toggle("active", b.dataset.tab === key));
    Object.entries(panels).forEach(([k, p]) => p && p.classList.toggle("active", k === key));
    localStorage.setItem("tc_agent_tab", key);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => openTab(btn.dataset.tab));
  });

  openTab(localStorage.getItem("tc_agent_tab") || "taskboard");

  // SYSTEM buttons (demo log)
  const log = document.getElementById("sysLog");
  const write = (t) => { if (log) log.textContent = `${t}\n` + log.textContent; };

  const s = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener("click", fn); };
  s("btnStartAll", () => write("✅ Start All — agents running"));
  s("btnStopAll", () => write("🛑 Stop All — agents paused"));
  s("btnRunScan", () => write("🔎 Run Scan — checked routing + exceptions"));
  s("btnClearLog", () => { if (log) log.textContent = "Ready."; });
})();
