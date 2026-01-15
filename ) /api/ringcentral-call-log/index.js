// /api/ringcentral-calls/index.js
export default async function (context, req) {
  try {
    const server = process.env.RC_SERVER_URL || "https://platform.ringcentral.com";

    // 1) Get token from our token function
    const tokenRes = await fetch(`${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/api/ringcentral-token`);
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      context.res = { status: 500, body: { error: "Could not get access token", detail: tokenData } };
      return;
    }

    const accessToken = tokenData.access_token;

    // 2) Pull call log (latest 100)
    const url = `${server}/restapi/v1.0/account/~/call-log?perPage=100&view=Simple`;
    const r = await fetch(url, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await r.json();

    if (!r.ok) {
      context.res = { status: r.status, body: { error: "Call-log error", detail: data } };
      return;
    }

    // Return the call log records only
    context.res = { status: 200, body: { records: data.records || [] } };
  } catch (e) {
    context.res = { status: 500, body: { error: String(e) } };
  }
}
