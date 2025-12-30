function pad(n){ return String(n).padStart(2,"0"); }

function updateClock(){
  const now = new Date();
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const d = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const t = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const dateEl = document.getElementById("sysDate");
  const timeEl = document.getElementById("sysTime");
  if(dateEl) dateEl.textContent = d;
  if(timeEl) timeEl.textContent = t;
}

/* --- NUCLEAR DATA (placeholder now, real data later) --- */
const companies = [
  { key:"all", name:"All", href:"#"},
  { key:"titancore", name:"TitanCore", href:"./companies/titancore-holdings.html"},
  { key:"vaultara", name:"Vaultara", href:"./companies/vaultara-capital.html"},
  { key:"vitalpath", name:"VitalPath", href:"./companies/vitalpath-care-group.html"},
  { key:"revmotion", name:"RevMotion", href:"./companies/revmotion-auto-marine.html"},
  { key:"familyfirst", name:"Family First", href:"./companies/family-first-equity.html"},
];

const portfolioStock = [
  { key:"titancore", label:"TitanCore Holdings", status:"good", trend:"up", metric:"Holding • Control", href:"./companies/titancore-holdings.html" },
  { key:"vaultara", label:"Vaultara Capital", status:"warn", trend:"flat", metric:"Capital • Lending", href:"./companies/vaultara-capital.html" },
  { key:"vitalpath", label:"VitalPath Care Group", status:"good", trend:"up", metric:"Care • Growth", href:"./companies/vitalpath-care-group.html" },
  { key:"revmotion", label:"RevMotion Auto & Marine", status:"warn", trend:"down", metric:"Ops • Needs review", href:"./companies/revmotion-auto-marine.html" },
  { key:"familyfirst", label:"Family First Equity", status:"good", trend:"flat", metric:"Equity • Stable", href:"./companies/family-first-equity.html" },
];

const globalNews = [
  { company:"titancore", text:"Policy update: contract routing now requires TitanCore review before client send.", time:"Today" },
  { company:"vaultara", text:"Capital pipeline: review funding requests + repayment schedule draft.", time:"Today" },
  { company:"vitalpath", text:"Operations: staffing + department structure confirmed (Manager + Asst Manager + team).", time:"This week" },
  { company:"revmotion", text:"Compliance: review vendor contracts and insurance documentation.", time:"This week" },
  { company:"familyfirst", text:"Investment: project feasibility review queued for approval.", time:"This week" },
];

const globalAlerts = [
  "Approvals: 2 contracts waiting for TitanCore review (Report & Approval).",
  "Security: 1 new access request pending verification.",
  "Compliance: tax network deadlines review recommended this week.",
];

function renderFilters(){
  const host = document.getElementById("newsFilters");
  if(!host) return;

  host.innerHTML = "";
  companies.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "fbtn" + (i===0 ? " active" : "");
    b.textContent = c.name;
    b.dataset.key = c.key;
    b.addEventListener("click", () => {
      document.querySelectorAll(".fbtn").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderNews(c.key);
    });
    host.appendChild(b);
  });
}

function renderNews(filterKey){
  const ul = document.getElementById("newsFeed");
  if(!ul) return;

  const items = (filterKey === "all")
    ? globalNews
    : globalNews.filter(n => n.company === filterKey);

  ul.innerHTML = "";
  if(items.length === 0){
    const li = document.createElement("li");
    li.textContent = "No updates yet.";
    ul.appendChild(li);
    return;
  }

  items.forEach(n => {
    const li = document.createElement("li");
    li.innerHTML = `${n.text} <small>• ${n.time}</small>`;
    ul.appendChild(li);
  });
}

function renderStock(){
  const host = document.getElementById("portfolioStock");
  if(!host) return;

  host.innerHTML = "";
  portfolioStock.forEach(s => {
    const a = document.createElement("a");
    a.className = "srow";
    a.href = s.href;

    const trendClass = s.trend === "up" ? "up" : (s.trend === "down" ? "down" : "flat");
    const trendSymbol = s.trend === "up" ? "↑" : (s.trend === "down" ? "↓" : "→");

    a.innerHTML = `
      <div class="sleft">
        <div class="sname">${s.label}</div>
        <div class="smeta">${s.metric}</div>
      </div>
      <div class="sright">
        <span class="trend ${trendClass}">${trendSymbol}</span>
        <span class="pillstat ${s.status}">${s.status.toUpperCase()}</span>
      </div>
    `;
    host.appendChild(a);
  });
}

function renderAlerts(){
  const ul = document.getElementById("alertsList");
  if(!ul) return;

  ul.innerHTML = "";
  globalAlerts.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    ul.appendChild(li);
  });
}

function renderKpis(){
  // Placeholder values (later we connect real numbers)
  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };

  set("kpiCash", "$ —");
  set("kpiRisk", "GREEN");
  set("kpiRiskNote", "Controlled");
  set("kpiApprovals", "2");
  set("kpiSecurity", "SECURE");
  set("kpiCompliance", "ON TRACK");
  set("kpiProjects", "—");
  set("kpiCritical", "0");
  set("kpiFocus", "Approvals + Finance Review");
}

/* Boot */
updateClock();
setInterval(updateClock, 1000);

renderFilters();
renderNews("all");
renderStock();
renderAlerts();
renderKpis();
