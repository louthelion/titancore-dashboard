// Azure Static Web Apps API — RingCentral token via JWT
// REQUIRED env vars:
// RC_CLIENT_ID, RC_CLIENT_SECRET, RC_JWT, RC_SERVER_URL (https://platform.ringcentral.com or sandbox)

let cached = { token: null, exp: 0 };

async function fetchToken() {
  const clientId = process.env.RC_CLIENT_ID;
  const clientSecret = process.env.RC_CLIENT_SECRET;
  const jwt = process.env.RC_JWT;
  const serverUrl = process.env.RC_SERVER_URL || "https://platform.ringcentral.com";

  if (!clientId || !clientSecret || !jwt) {
    throw new Error("Missing RingCentral env vars. Set RC_CLIENT_ID, RC_CLIENT_SECRET, RC_JWT, RC_SERVER_URL.");
  }

  // Cache for ~50 minutes
  const now = Date.now();
  if (cached.token && cached.exp > now + 60_000) return cached.token;

  const tokenUrl = `${serverUrl}/restapi/oauth/token`;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const body = new URLSearchParams();
  body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.set("assertion", jwt);

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const json = await resp.json();
  if (!resp.ok) {
    const msg = json?.error_description || json?.message || JSON.stringify(json);
    throw new Error(`RingCentral token error: ${msg}`);
  }

  cached.token = json.access_token;
  // expires_in is seconds
  cached.exp = now + (Number(json.expires_in || 3600) * 1000);

  return cached.token;
}

module.exports = async function (context, req) {
  try {
    const token = await fetchToken();
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { ok: true, token: "secured", hasToken: !!token }
    };
  } catch (e) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { ok: false, error: e.message }
    };
  }
};

// Export for reuse
module.exports.fetchToken = fetchToken;
