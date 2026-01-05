/* TitanCore Executive Control Center — app.js */

(function () {
  // --- Clock ---
  function tick() {
    const now = new Date();
    const date = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const d = document.getElementById("tcDate");
    const t = document.getElementById("tcTime");
    if (d) d.textContent = date;
    if (t) t.textContent = time;
  }
  tick();
  setInterval(tick, 1000);

  // --- Role-based Access (front-end) ---
  const allowedRoles = ["CEO", "MANTLE", "GM"];
  const ROLE_KEY = "tc_role";

  function getRole() {
    const stored = localStorage.getItem(ROLE_KEY);
    return allowedRoles.includes(stored) ? stored : "CEO";
  }

  function setRole(role) {
    if (!allowedRoles.includes(role)) return;
    localStorage.setItem(ROLE_KEY, role);
    applyRole();
  }

  function applyRole() {
    const role = getRole();

    // highlight role buttons
    document.querySelectorAll(".rolebtn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.role === role);
    });

    // show/hide sections by data-allow
    const sections = document.querySelectorAll("[data-allow]");
    let anyShown = false;

    sections.forEach(el => {
      const allow = (el.getAttribute("data-allow") || "").split(",").map(s => s.trim()).filter(Boolean);
      const ok = allow.includes(role);
      el.classList.toggle("hidden", !ok);
      if (ok) anyShown = true;
    });

    const noAccess = document.getElementById("noAccessPanel");
    if (noAccess) noAccess.classList.toggle("hidden", anyShown);
  }

  // wire role buttons
  document.querySelectorAll(".rolebtn").forEach(btn => {
    btn.addEventListener("click", () => setRole(btn.dataset.role));
  });

  applyRole();

  // --- Agent Systems → Executive Control Integration (mock now, real later) ---
  let agentAlerts = 2;

  function renderAgents() {
    const pillAlerts = document.getElementById("pillAgentAlerts");
    const latest = document.getElementById("agentLatest");
    if (pillAlerts) pillAlerts.textContent = `${agentAlerts} agent alerts`;

    if (latest) {
      if (agentAlerts === 0) latest.textContent = "No alerts. Systems stable.";
      else if (agentAlerts === 1) latest.textContent = "Compliance Agent flagged 1 upcoming deadline.";
      else latest.textContent = "Contract Review Agent flagged 1 doc • Compliance Agent flagged 1 deadline.";
    }
  }
  renderAgents();

  const btnSweep = document.getElementById("btnRunAgentSweep");
  const btnClear = document.getElementById("btnClearAgentAlerts");

  if (btnSweep) {
    btnSweep.addEventListener("click", () => {
      // simulate sweep
      agentAlerts = Math.max(0, agentAlerts + 1);
      renderAgents();
      alert("Agent Sweep complete. Alerts updated.");
    });
  }

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      agentAlerts = 0;
      renderAgents();
      alert("Agent alerts cleared.");
    });
  }
})();  // ===============================
  // ACTIVE MODE TOGGLE (WORKING)
  // ===============================
  const activeBtn = document.getElementById("activeToggle");

  if (activeBtn) {
    const saved = localStorage.getItem("titan_mode") || "ACTIVE";
    activeBtn.textContent = saved;

    activeBtn.addEventListener("click", () => {
      const next = activeBtn.textContent === "ACTIVE" ? "PAUSED" : "ACTIVE";
      localStorage.setItem("titan_mode", next);
      activeBtn.textContent = next;
    });
  }
// Tab switch
document.querySelectorAll(".tabbtn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".tabbtn").forEach(b=>{
      b.classList.remove("active");
      b.setAttribute("aria-selected","false");
    });
    document.querySelectorAll(".tabpanel").forEach(p=>p.classList.remove("show"));

    btn.classList.add("active");
    btn.setAttribute("aria-selected","true");
    const id = btn.getAttribute("data-tab");
    const panel = document.getElementById(id);
    if(panel) panel.classList.add("show");
  });
});

// Agent System demo controls
const sysLog = document.getElementById("sysLog");
function setLog(text){
  if(sysLog) sysLog.textContent = text;
}

document.getElementById("btnStartAll")?.addEventListener("click", ()=>{
  setLog("Last run: START ALL • Status: ACTIVE");
});
document.getElementById("btnStopAll")?.addEventListener("click", ()=>{
  setLog("Last run: STOP ALL • Status: PAUSED");
});
document.getElementById("btnRunScan")?.addEventListener("click", ()=>{
  setLog("Last run: SCAN NOW • Status: CHECKING");
});
document.getElementById("btnClearLog")?.addEventListener("click", ()=>{
  setLog("Last run: — • Status: —");
});
