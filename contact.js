/* contact.js
   This runs the demo numbers so you SEE the page change immediately.
   Real RingCentral data will come later from a secure backend (Azure Function).
*/

(function () {
  const $ = (id) => document.getElementById(id);

  function setNum(id, n) {
    const el = $(id);
    if (el) el.textContent = String(n);
  }

  function loadDemo() {
    // Demo numbers (replace later with real API results)
    setNum("callsIn", 128);
    setNum("callsOut", 94);
    setNum("transfers", 23);
    setNum("missed", 7);

    const rows = document.querySelectorAll("#routingRows tr");
    // Just drop demo stats into the 3rd and 4th columns for each company row
    const demoStats = [
      ["TitanCore Holdings", "44", "1"],
      ["Vaultara Capital", "22", "2"],
      ["VitalPath Care Group", "31", "3"],
      ["RevMotion Auto & Marine", "19", "1"],
      ["Family First Equity", "12", "0"],
    ];

    rows.forEach((tr, i) => {
      const tds = tr.querySelectorAll("td");
      if (tds.length >= 4 && demoStats[i]) {
        tds[2].textContent = demoStats[i][1];
        tds[3].textContent = demoStats[i][2];
      }
    });

    const rcStatus = $("rcStatus");
    const rcHint = $("rcHint");
    if (rcStatus) rcStatus.textContent = "DEMO CONNECTED • Local numbers";
    if (rcHint) rcHint.textContent = "Next: Replace demo with Azure Function → RingCentral";
  }

  function wire() {
    const demoBtn = $("demoBtn");
    if (demoBtn) demoBtn.addEventListener("click", loadDemo);
  }

  document.addEventListener("DOMContentLoaded", wire);
})();
