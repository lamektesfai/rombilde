import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResultEmail(params: { to: string; resultImageUrl: string }) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Rombilde <onboarding@resend.dev>",
    to: params.to,
    subject: "Rommet ditt er ferdig møblert!",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">Rommet ditt er ferdig møblert</h1>
        <p>Her er resultatet:</p>
        <img src="${params.resultImageUrl}" alt="Ferdig møblert rom" style="width: 100%; border-radius: 12px;" />
        <p><a href="${params.resultImageUrl}">Last ned bildet i full størrelse</a></p>
        <p style="color: #4B5148; font-size: 13px;">Hilsen Rombilde</p>
      </div>
    `,
  });
}

export async function sendFailureEmail(params: { to: string; refunded: boolean }) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Rombilde <onboarding@resend.dev>",
    to: params.to,
    subject: "Vi klarte dessverre ikke å møblere rommet ditt",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">Noe gikk galt</h1>
        <p>Vi klarte dessverre ikke å møblere rommet ditt denne gangen, selv etter flere forsøk.</p>
        <p>${
          params.refunded
            ? "Betalingen din er refundert, og du er ikke belastet for dette kjøpet."
            : "Vi jobber med å refundere betalingen din, og du hører fra oss om kort tid."
        }</p>
        <p>Du er velkommen til å prøve på nytt med samme eller et annet bilde.</p>
        <p style="color: #4B5148; font-size: 13px;">Hilsen Rombilde</p>
      </div>
    `,
  });
}
