// TitanCore Contact Command — RingCentral-ready UI
const $ = (id) => document.getElementById(id);

function setDateTime() {
  const d = new Date();
  const opts = { weekday:"short", month:"short", day:"2-digit", year:"numeric" };
  const date = d.toLocaleDateString(undefined, opts);
  const time = d.toLocaleTimeString(undefined, { hour:"2-digit", minute:"2-digit" });
  $("datetime").textContent = `${date} • ${time}`;
}
setDateTime();
setInterval(setDateTime, 1000 * 30);

const views = ["overview","calls","transfers","analytics"];
function showView(name){
  views.forEach(v => {
    const el = $(`view-${v}`);
    if (!el) return;
    el.classList.toggle("hidden", v !== name);
  });
}

document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

// Default view
showView("overview");

function safeText(x){ return (x ?? "").toString(); }
function fmtTime(iso){
  if(!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month:"short", day:"2-digit", hour:"2-digit", minute:"2-digit" });
}
function fmtSeconds(s){
  const n = Number(s || 0);
  if (!Number.isFinite(n)) return "—";
  const m = Math.floor(n / 60);
  const r = n % 60;
  return `${m}m ${r}s`;
}

function classifyCompany(numberOrExt){
  const v = safeText(numberOrExt).toLowerCase();
  // You can later map real numbers to companies here.
  // For now, we keep it simple.
  if (v.includes("vault")) return "VAULTARA";
  if (v.includes("vital")) return "VITALPATH";
  if (v.includes("revm")) return "REVMOTION";
  if (v.includes("family")) return "FAMILYFIRST";
  return "TITANCORE";
}

function looksLikeTransfer(record){
  // Transfers vary by RC account; we use a conservative heuristic.
  const action = safeText(record?.action).toLowerCase();
  const result = safeText(record?.result).toLowerCase();
  const reason = safeText(record?.reason).toLowerCase();
  const from = safeText(record?.from?.phoneNumber || record?.from?.extensionNumber);
  const to = safeText(record?.to?.phoneNumber || record?.to?.extensionNumber);

  const flag =
    action.includes("transfer") ||
    reason.includes("transfer") ||
    result.includes("transferred") ||
    (from && to && from !== to && safeText(record?.direction).toLowerCase() === "inbound" && action.includes("phone"));

  return flag;
}

function addListItem(ol, label, value){
  const li = document.createElement("li");
  li.textContent = `${label} — ${value}`;
  ol.appendChild(li);
}

async function load(){
  const days = $("days").value;
  const company = $("company").value;

  $("kpiIn").textContent = "…";
  $("kpiOut").textContent = "…";
  $("kpiMissed").textContent = "…";
  $("kpiXfer").textContent = "…";
  $("callsBody").innerHTML = "";
  $("xferBody").innerHTML = "";
  $("topCallers").innerHTML = "";
  $("topTo").innerHTML = "";

  const res = await fetch(`/api/ringcentral-call-log?days=${encodeURIComponent(days)}`);
  const data = await res.json();

  if(!res.ok){
    $("kpiIn").textContent = "ERR";
    $("kpiOut").textContent = "ERR";
    $("kpiMissed").textContent = "ERR";
    $("kpiXfer").textContent = "ERR";
    $("callsBody").innerHTML = `<tr><td colspan="6">${safeText(data?.error || "RingCentral API not connected yet.")}</td></tr>`;
    return;
  }

  const records = Array.isArray(data.records) ? data.records : [];
  const filtered = records.filter(r => {
    if (company === "ALL") return true;
    const from = safeText(r?.from?.phoneNumber || r?.from?.extensionNumber);
    const to = safeText(r?.to?.phoneNumber || r?.to?.extensionNumber);
    const c = classifyCompany(from + " " + to);
    return c === company;
  });

  let inCount = 0, outCount = 0, missed = 0, xfers = 0;

  const callers = new Map();
  const tos = new Map();

  filtered.forEach(r => {
    const dir = safeText(r.direction).toLowerCase();
    if (dir === "inbound") inCount++;
    if (dir === "outbound") outCount++;

    const result = safeText(r.result).toLowerCase();
    if (result.includes("missed") || result.includes("no answer")) missed++;

    if (looksLikeTransfer(r)) xfers++;

    const from = safeText(r?.from?.phoneNumber || r?.from?.extensionNumber || "Unknown");
    const to = safeText(r?.to?.phoneNumber || r?.to?.extensionNumber || "Unknown");
    callers.set(from, (callers.get(from) || 0) + 1);
    tos.set(to, (tos.get(to) || 0) + 1);
  });

  $("kpiIn").textContent = inCount;
  $("kpiOut").textContent = outCount;
  $("kpiMissed").textContent = missed;
  $("kpiXfer").textContent = xfers;

  // Call Log table
  const body = $("callsBody");
  if(filtered.length === 0){
    body.innerHTML = `<tr><td colspan="6">No call log records for this window.</td></tr>`;
  } else {
    filtered.slice(0, 100).forEach(r => {
      const tr = document.createElement("tr");
      const from = safeText(r?.from?.phoneNumber || r?.from?.extensionNumber || "—");
      const to = safeText(r?.to?.phoneNumber || r?.to?.extensionNumber || "—");
      tr.innerHTML = `
        <td>${fmtTime(r.startTime)}</td>
        <td>${safeText(r.direction)}</td>
        <td>${from}</td>
        <td>${to}</td>
        <td>${safeText(r.result || r.action || "—")}</td>
        <td>${fmtSeconds(r.duration)}</td>
      `;
      body.appendChild(tr);
    });
  }

  // Transfers table
  const xbody = $("xferBody");
  const xlist = filtered.filter(looksLikeTransfer).slice(0, 100);
  if(xlist.length === 0){
    xbody.innerHTML = `<tr><td colspan="4">No transfer-like records detected.</td></tr>`;
  } else {
    xlist.forEach(r => {
      const tr = document.createElement("tr");
      const from = safeText(r?.from?.phoneNumber || r?.from?.extensionNumber || "—");
      const to = safeText(r?.to?.phoneNumber || r?.to?.extensionNumber || "—");
      const reason = safeText(r?.action || r?.reason || r?.result || "transfer");
      tr.innerHTML = `
        <td>${fmtTime(r.startTime)}</td>
        <td>${from}</td>
        <td>${to}</td>
        <td>${reason}</td>
      `;
      xbody.appendChild(tr);
    });
  }

  // Analytics
  const topCallers = [...callers.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);
  const topTo = [...tos.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8);

  if(topCallers.length === 0){
    $("topCallers").innerHTML = "<li>—</li>";
  } else {
    topCallers.forEach(([k,v]) => addListItem($("topCallers"), k, v));
  }

  if(topTo.length === 0){
    $("topTo").innerHTML = "<li>—</li>";
  } else {
    topTo.forEach(([k,v]) => addListItem($("topTo"), k, v));
  }
}

$("refresh").addEventListener("click", load);
$("days").addEventListener("change", load);
$("company").addEventListener("change", load);

// First load
load().catch(err => {
  $("callsBody").innerHTML = `<tr><td colspan="6">Error: ${safeText(err.message)}</td></tr>`;
});
