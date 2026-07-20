import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const LOGO_URL = "https://www.rombilde.no/logo-rombilde-512.png";

function emailWrapper(innerHtml: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4EF; padding:32px 16px; font-family: Helvetica, Arial, sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%; background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #D8D2C4;">
            <tr>
              <td align="center" style="background-color:#2E4034; padding:28px;">
                <img src="${LOGO_URL}" width="48" height="48" alt="Rombilde" style="display:block; border-radius:12px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${innerHtml}
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 32px; background-color:#EFEBE1;">
                <p style="margin:0; font-size:12px; color:#4B5148;">Hilsen Rombilde · rombilde.no</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export async function sendResultEmail(params: { to: string; resultImageUrl: string }) {
  const inner = `
    <h1 style="margin:0 0 8px; font-size:22px; color:#1F2420;">Takk for kjøpet!</h1>
    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#4B5148;">
      Rommet ditt er ferdig møblert og klart til å lastes ned. Bruk bildet i annonsen din på Finn.no eller der du selger boligen.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:24px;">
          <img src="${params.resultImageUrl}" width="416" alt="Ferdig møblert rom" style="display:block; width:100%; max-width:416px; border-radius:12px; border:1px solid #D8D2C4;" />
        </td>
      </tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom:12px;">
          <a href="${params.resultImageUrl}" style="display:inline-block; background-color:#2E4034; color:#F6F4EF; text-decoration:none; font-weight:600; font-size:15px; padding:14px 32px; border-radius:999px;">
            Last ned bildet
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0; font-size:12px; text-align:center; color:#7C93A3;">
      Fungerer ikke knappen? Bruk denne lenken:<br />
      <a href="${params.resultImageUrl}" style="color:#2E4034;">${params.resultImageUrl}</a>
    </p>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Rombilde <onboarding@resend.dev>",
    to: params.to,
    subject: "Rommet ditt er ferdig møblert!",
    html: emailWrapper(inner),
  });
}

export async function sendFailureEmail(params: { to: string; refunded: boolean }) {
  const inner = `
    <h1 style="margin:0 0 8px; font-size:22px; color:#1F2420;">Noe gikk galt</h1>
    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#4B5148;">
      Vi klarte dessverre ikke å møblere rommet ditt denne gangen, selv etter flere forsøk.
    </p>
    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#4B5148;">
      ${
        params.refunded
          ? "Betalingen din er refundert, og du er ikke belastet for dette kjøpet."
          : "Vi jobber med å refundere betalingen din, og du hører fra oss om kort tid."
      }
    </p>
    <p style="margin:0; font-size:15px; line-height:1.6; color:#4B5148;">
      Du er velkommen til å prøve på nytt med samme eller et annet bilde.
    </p>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Rombilde <onboarding@resend.dev>",
    to: params.to,
    subject: "Vi klarte dessverre ikke å møblere rommet ditt",
    html: emailWrapper(inner),
  });
}
