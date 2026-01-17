// TitanCore Global Menu System (no broken links)

const MINI = {
  dashboard: [
    ["Executive Overview", "module.html?parent=dashboard&m=exec_overview"],
    ["Companies", "module.html?parent=dashboard&m=companies"],
    ["Leadership", "module.html?parent=dashboard&m=leadership"],
    ["System Status", "module.html?parent=dashboard&m=system_status"]
  ],
  contact: [
    ["Calls In (24h)", "module.html?parent=contact&m=inbound"],
    ["Calls Out (24h)", "module.html?parent=contact&m=outbound"],
    ["Transfers", "module.html?parent=contact&m=transfers"],
    ["Escalations", "module.html?parent=contact&m=escalations"]
  ],
  contract: [
    ["Pipeline Status", "module.html?parent=contract&m=pipeline"],
    ["Packages Awaiting Review", "module.html?parent=contract&m=packages"],
    ["Company Sign-off Queue", "module.html?parent=contract&m=company_signoff"],
    ["TitanCore Approval Queue", "module.html?parent=contract&m=titan_approval"]
  ],
  email: [
    ["Global Inbox Flow", "module.html?parent=email&m=flow"],
    ["Routing Visibility", "module.html?parent=email&m=routing"],
    ["Priority / Escalations", "module.html?parent=email&m=priority"],
    ["Audit Trail", "module.html?parent=email&m=audit"]
  ],
  report: [
    ["Cross-Company KPIs", "module.html?parent=report&m=kpis"],
    ["Risk Radar", "module.html?parent=report&m=risk"],
    ["Weekly Executive Summary", "module.html?parent=report&m=weekly"],
    ["View All Reports", "module.html?parent=report&m=all"]
  ],
  approval: [
    ["Authority Chain", "module.html?parent=approval&m=chain"],
    ["Pending Signatures", "module.html?parent=approval&m=pending"],
    ["Completed Approvals", "module.html?parent=approval&m=done"],
    ["Escalation Rules", "module.html?parent=approval&m=rules"]
  ],
  omni: [
    ["System Orchestration", "module.html?parent=omni&m=orchestration"],
    ["Agent Activity", "module.html?parent=omni&m=agents"],
    ["Workflows", "module.html?parent=omni&m=workflows"],
    ["Health & Alerts", "module.html?parent=omni&m=health"]
  ],
  tax: [
    ["Jurisdiction Matrix", "module.html?parent=tax&m=matrix"],
    ["Compliance Status", "module.html?parent=tax&m=status"],
    ["Deadline Calendar", "module.html?parent=tax&m=calendar"],
    ["Documents / Audit Shield", "module.html?parent=tax&m=docs"]
  ],
  ai: [
    ["Agents", "module.html?parent=ai&m=agents"],
    ["Playbooks", "module.html?parent=ai&m=playbooks"],
    ["Orchestration", "module.html?parent=ai&m=orchestration"],
    ["Logs", "module.html?parent=ai&m=logs"]
  ],
  public: [
    ["Intake Queue", "module.html?parent=public&m=intake"],
    ["Traffic Intelligence", "module.html?parent=public&m=traffic"],
    ["Public Visibility", "module.html?parent=public&m=visibility"],
    ["Conversions", "module.html?parent=public&m=conversions"]
  ],
  finance: [
    ["Executive Summary", "module.html?parent=finance&m=summary"],
    ["Cash View", "module.html?parent=finance&m=cash"],
    ["Approvals Impact", "module.html?parent=finance&m=impact"],
    ["Read-only Statements", "module.html?parent=finance&m=statements"]
  ]
};

function qs(name){
  return new URLSearchParams(location.search).get(name);
}

function setClock(){
  const el = document.getElementById("tcTime");
  if(!el) return;
  const d = new Date();
  el.textContent = d.toLocaleString(undefined, {weekday:"short", month:"short", day:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit"});
}

function openMini(key){
  const modal = document.getElementById("miniModal");
  const list  = document.getElementById("miniList");
  const title = document.getElementById("miniTitle");
  const full  = document.getElementById("miniFull");

  if(!modal || !list || !title || !full) return;

  const rows = MINI[key] || [];
  title.textContent = (key === "dashboard") ? "Dashboard" : key.toUpperCase();

  list.innerHTML = "";
  rows.forEach(([label, href])=>{
    const a = document.createElement("a");
    a.className = "miniLink";
    a.href = href;
    a.innerHTML = `${label} <span>→</span>`;
    list.appendChild(a);
  });

  // Full page goes to page.html?id=KEY (except dashboard has no full page)
  if(key === "dashboard"){
    full.href = "index.html";
    full.textContent = "Open Full Page";
  }else{
    full.href = `page.html?id=${encodeURIComponent(key)}`;
    full.textContent = "Open Full Page";
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
}

function wireMiniButtons(){
  document.querySelectorAll(".dropBtn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const key = btn.getAttribute("data-mini");
      if(!key) return;
      openMini(key);
    });
  });

  const close = document.getElementById("miniClose");
  const modal = document.getElementById("miniModal");
  if(close && modal){
    close.addEventListener("click", ()=>{
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden","true");
    });
    modal.addEventListener("click", (e)=>{
      if(e.target === modal){
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden","true");
      }
    });
  }
}

function renderPage(){
  const id = qs("id");
  const title = document.getElementById("pageTitle");
  const sub   = document.getElementById("pageSub");
  const body  = document.getElementById("pageBody");
  if(!title || !body || !id) return;

  const map = {
    contact: ["Contact", "Call volume • transfers • company routing • visibility only"],
    contract:["Contract", "Data tracking • status • approvals • read-only"],
    email:   ["Email Routing", "Global inbox flow • routing visibility • executive read-only"],
    report:  ["Report", "Global reporting • cross-company intelligence • executive visibility"],
    approval:["Approval", "Signature flow • authority chain • no editing"],
    omni:    ["Omni System", "Global system intelligence • orchestration visibility"],
    tax:     ["Tax Network", "Deadlines • compliance • alerts"],
    ai:      ["Agent A.I. Suite", "Agents • systems • orchestration visibility"],
    public:  ["Public Portal", "Intake • visibility • traffic intelligence"],
    finance: ["Finance", "Read-only executive view"],
    person:  ["Leadership", "Role dashboard • quick actions • meetings"],
    company: ["Company", "High-level executive visibility"]
  };

  const [t,s] = map[id] || ["TitanCore", "Executive read-only view"];
  title.textContent = t;
  if(sub) sub.textContent = s;

  // Heavy-looking content blocks (executive read-only)
  body.innerHTML = `
    <div class="block">
      <div style="color:var(--green);font-weight:900;margin-bottom:6px">Status</div>
      <div>UI ready. Data feeds connect later.</div>
    </div>
    <div class="divider"></div>
    <div class="block">
      <div style="color:var(--green);font-weight:900;margin-bottom:6px">Quick Access</div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
        ${(MINI[id]||[]).map(([label,href])=>`<a class="miniLink" href="${href}">${label} <span>→</span></a>`).join("")}
      </div>
    </div>
    <div class="divider"></div>
    <div class="block">
      <div style="color:var(--green);font-weight:900;margin-bottom:6px">Notes</div>
      <div>This page is executive visibility only. Editing happens inside company systems.</div>
    </div>
  `;
}

function renderModule(){
  const parent = qs("parent");
  const m = qs("m");
  const title = document.getElementById("modTitle");
  const sub   = document.getElementById("modSub");
  const body  = document.getElementById("modBody");
  const goFull= document.getElementById("goFull");
  if(!title || !body || !parent) return;

  const niceParent = parent.toUpperCase();
  title.textContent = `${niceParent} • Module`;
  if(sub) sub.textContent = `Quick view: ${m || "detail"}`;
  if(goFull) goFull.href = `page.html?id=${encodeURIComponent(parent)}`;

  body.innerHTML = `
    <div style="color:var(--green);font-weight:900;margin-bottom:8px">Module</div>
    <div style="margin-bottom:12px">This is a quick executive view. Real data connects later.</div>
    <div class="divider"></div>
    <div style="color:var(--green);font-weight:900;margin:10px 0 8px">Fields</div>
    <div>Time • In/Out • Company • Result • Notes</div>
    <div class="divider"></div>
    <div style="color:var(--green);font-weight:900;margin:10px 0 8px">Actions</div>
    <div>Read-only: export / view / route visibility.</div>
  `;
}

setInterval(setClock, 1000);
setClock();
wireMiniButtons();
renderPage();
renderModule();
