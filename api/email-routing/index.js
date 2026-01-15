// /api/ms-token/index.js
export default async function (context, req) {
  try {
    const tenantId = process.env.MS_TENANT_ID;
    const clientId = process.env.MS_CLIENT_ID;
    const clientSecret = process.env.MS_CLIENT_SECRET;

    if (!tenantId || !clientId || !clientSecret) {
      context.res = { status: 500, body: { error: "Missing MS Graph env vars." } };
      return;
    }

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

    const form = new URLSearchParams();
    form.set("client_id", clientId);
    form.set("client_secret", clientSecret);
    form.set("grant_type", "client_credentials");
    form.set("scope", "https://graph.microsoft.com/.default");

    const r = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });

    const data = await r.json();

    if (!r.ok) {
      context.res = { status: r.status, body: { error: "MS token error", detail: data } };
      return;
    }

    context.res = { status: 200, body: data };
  } catch (e) {
    context.res = { status: 500, body: { error: String(e) } };
  }
}
