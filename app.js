// app.js — TitanCore dashboard router (ROOT pages)

const ROUTES = {
  contact: "contact.html",
  contract: "contract.html",

  // Email Routing page in your repo is "routing.html"
  email: "routing.html",

  report: "report.html",
  approval: "approval.html",
  omni: "omni-system.html",
  tax: "tax-network.html",

  // AI Suite in your repo is agent-suite.html
  ai: "agent-suite.html",

  public: "public-portal.html",
  finance: "finance.html",
};

function openRoute(key) {
  const target = ROUTES[key];

  if (!target) {
    alert(`Missing route for: ${key}`);
    return;
  }

  // Use relative path so it works on Azure Static Web Apps
  window.location.href = `./${target}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // Main menu buttons
  document.querySelectorAll(".itemBtn[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openRoute(btn.dataset.open));
  });

  // "OPEN" buttons on company/leadership cards (if you used data-open too)
  document.querySelectorAll("[data-open-page]").forEach((el) => {
    el.addEventListener("click", () => {
      const page = el.getAttribute("data-open-page");
      if (!page) return;
      window.location.href = `./${page}`;
    });
  });
});
