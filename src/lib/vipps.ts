import crypto from "node:crypto";

const VIPPS_BASE_URL = process.env.VIPPS_BASE_URL ?? "https://apitest.vipps.no";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getVippsAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const response = await fetch(`${VIPPS_BASE_URL}/accesstoken/get`, {
    method: "POST",
    headers: {
      client_id: process.env.VIPPS_CLIENT_ID ?? "",
      client_secret: process.env.VIPPS_CLIENT_SECRET ?? "",
      "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY ?? "",
    },
  });

  if (!response.ok) {
    throw new Error(`Kunne ikke hente Vipps access token: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: string };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) - 60) * 1000,
  };
  return cachedToken.value;
}

async function vippsHeaders(): Promise<HeadersInit> {
  const token = await getVippsAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    "Ocp-Apim-Subscription-Key": process.env.VIPPS_SUBSCRIPTION_KEY ?? "",
    "Merchant-Serial-Number": process.env.VIPPS_MERCHANT_SERIAL_NUMBER ?? "",
    "Vipps-System-Name": "rombilde",
    "Content-Type": "application/json",
  };
}

export async function createVippsPayment(params: {
  reference: string;
  amountOre: number;
  returnUrl: string;
  description: string;
}): Promise<{ redirectUrl: string; reference: string }> {
  const response = await fetch(`${VIPPS_BASE_URL}/epayment/v1/payments`, {
    method: "POST",
    headers: await vippsHeaders(),
    body: JSON.stringify({
      amount: { currency: "NOK", value: params.amountOre },
      paymentMethod: { type: "WALLET" },
      reference: params.reference,
      returnUrl: params.returnUrl,
      userFlow: "WEB_REDIRECT",
      paymentDescription: params.description,
    }),
  });

  if (!response.ok) {
    throw new Error(`Kunne ikke opprette Vipps-betaling: ${response.status}`);
  }

  return response.json();
}

export async function captureVippsPayment(reference: string, amountOre: number) {
  const response = await fetch(
    `${VIPPS_BASE_URL}/epayment/v1/payments/${reference}/capture`,
    {
      method: "POST",
      headers: await vippsHeaders(),
      body: JSON.stringify({
        modificationAmount: { currency: "NOK", value: amountOre },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Kunne ikke fange Vipps-betaling: ${response.status}`);
  }

  return response.json();
}

export async function refundVippsPayment(reference: string, amountOre: number) {
  const response = await fetch(
    `${VIPPS_BASE_URL}/epayment/v1/payments/${reference}/refund`,
    {
      method: "POST",
      headers: await vippsHeaders(),
      body: JSON.stringify({
        modificationAmount: { currency: "NOK", value: amountOre },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Kunne ikke refundere Vipps-betaling: ${response.status}`);
  }

  return response.json();
}

interface VippsWebhookHeaders {
  authorization: string | null;
  xMsDate: string | null;
  xMsContentSha256: string | null;
  host: string | null;
}

export function verifyVippsWebhookSignature(
  method: string,
  path: string,
  headers: VippsWebhookHeaders,
  rawBody: string
): boolean {
  const { authorization, xMsDate, xMsContentSha256, host } = headers;
  if (!authorization || !xMsDate || !xMsContentSha256 || !host) return false;

  const expectedContentHash = crypto.createHash("sha256").update(rawBody, "utf8").digest("base64");
  if (expectedContentHash !== xMsContentSha256) return false;

  const match = authorization.match(/^HMAC-SHA256 SignedHeaders=([^&]+)&Signature=(.+)$/);
  if (!match) return false;
  const [, signedHeaderNames, signature] = match;

  const headerValues: Record<string, string> = {
    "x-ms-date": xMsDate,
    host,
    "x-ms-content-sha256": xMsContentSha256,
  };

  const canonicalHeaders = signedHeaderNames
    .split(";")
    .map((name) => headerValues[name.toLowerCase()] ?? "")
    .join(";");

  const stringToSign = `${method}\n${path}\n${canonicalHeaders}`;
  const secret = Buffer.from(process.env.VIPPS_WEBHOOK_SECRET ?? "", "base64");
  const expectedSignature = crypto.createHmac("sha256", secret).update(stringToSign, "utf8").digest("base64");

  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length) return false;

  return crypto.timingSafeEqual(expected, actual);
}
