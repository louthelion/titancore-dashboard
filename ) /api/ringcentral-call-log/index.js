// Azure Static Web Apps API — RingCentral Call Log
// Uses the token helper above
const tokenMod = require("../ringcentral-token/index.js");

module.exports = async function (context, req) {
  try {
    const token = await tokenMod.fetchToken();

    const serverUrl = process.env.RC_SERVER_URL || "https://platform.ringcentral.com";
    const days = Math.max(1, Math.min(90, Number(req.query.days || 7)));

    const dateTo = new Date();
    const dateFrom = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const qs = new URLSearchParams();
    qs.set("view", "Simple");
    qs.set("dateFrom", dateFrom.toISOString());
    qs.set("dateTo", dateTo.toISOString());
    qs.set("perPage", "100");

    // Extension call log (change to account call log if you want broader scope)
    const url = `${serverUrl}/restapi/v1.0/account/~/extension/~/call-log?${qs.toString()}`;

    const resp = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    const json = await resp.json();
    if (!resp.ok) {
      const msg = json?.message || JSON.stringify(json);
      context.res = { status: 502, body: { ok: false, error: `RingCentral call-log error: ${msg}` } };
      return;
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { ok: true, records: json.records || [] }
    };
  } catch (e) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { ok: false, error: e.message }
    };
  }
};
