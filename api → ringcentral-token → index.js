// /api/ringcentral-token/index.js
export default async function (context, req) {
  try {
    const clientId = process.env.RC_CLIENT_ID;
    const clientSecret = process.env.RC_CLIENT_SECRET;
    const username = process.env.RC_USERNAME;
    const extension = process.env.RC_EXTENSION || "101";
    const password = process.env.RC_PASSWORD;
    const server = process.env.RC_SERVER_URL || "https://platform.ringcentral.com";

    if (!clientId || !clientSecret || !username || !password) {
      context.res = { status: 500, body: { error: "Missing RingCentral env vars." } };
      return;
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const form = new URLSearchParams();
    form.set("grant_type", "password");
    form.set("username", username);
    form.set("extension", extension);
    form.set("password", password);

    const r = await fetch(`${server}/restapi/oauth/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });

    const data = await r.json();

    if (!r.ok) {
      context.res = { status: r.status, body: { error: "Token error", detail: data } };
      return;
    }

    context.res = { status: 200, body: data };
  } catch (e) {
    context.res = { status: 500, body: { error: String(e) } };
  }
}
