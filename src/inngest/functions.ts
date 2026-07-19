import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { processJob } from "@/lib/pipeline";
import { refundVippsPayment } from "@/lib/vipps";
import { sendFailureEmail } from "@/lib/email";
import { deleteImageFromR2 } from "@/lib/r2";

export const processJobFunction = inngest.createFunction(
  {
    id: "process-job",
    retries: 2,
    triggers: { event: "job/paid" },
    onFailure: async ({ event, error }) => {
      const jobId = event.data.event.data.jobId as string;

      const payment = await prisma.payment.findFirst({
        where: { jobId, paymentStatus: "captured" },
      });

      let refunded = false;
      if (payment) {
        try {
          await refundVippsPayment(payment.id, payment.amount);
          await prisma.payment.update({
            where: { id: payment.id },
            data: { paymentStatus: "cancelled" },
          });
          refunded = true;
        } catch (refundError) {
          console.error(`Kunne ikke refundere betaling for jobb ${jobId}:`, refundError);
        }
      }

      const job = await prisma.job.update({
        where: { id: jobId },
        data: { status: "failed", failureReason: error.message },
      });

      try {
        await sendFailureEmail({ to: job.userEmail, refunded });
      } catch (emailError) {
        console.error(`Kunne ikke sende feil-e-post for jobb ${jobId}:`, emailError);
      }
    },
  },
  async ({ event }) => {
    await processJob(event.data.jobId);
  }
);

const BILDE_LAGRINGSTID_MANEDER = 6;

// Kjører daglig kl. 03:00. Sletter originalbilder fra R2 for jobber eldre enn
// BILDE_LAGRINGSTID_MANEDER, i tråd med personvernerklæringen.
export const cleanupOldImagesFunction = inngest.createFunction(
  { id: "cleanup-old-images", triggers: { cron: "0 3 * * *" } },
  async () => {
    const grense = new Date();
    grense.setMonth(grense.getMonth() - BILDE_LAGRINGSTID_MANEDER);

    const jobber = await prisma.job.findMany({
      where: { createdAt: { lt: grense }, imagesDeletedAt: null },
      select: { id: true, originalImageUrl: true },
    });

    let slettet = 0;

    for (const job of jobber) {
      try {
        if (job.originalImageUrl) {
          await deleteImageFromR2(job.originalImageUrl);
        }

        await prisma.job.update({
          where: { id: job.id },
          data: {
            originalImageUrl: null,
            intermediateImageUrl: null,
            resultImageUrl: null,
            imagesDeletedAt: new Date(),
          },
        });

        slettet++;
      } catch (error) {
        console.error(`Kunne ikke slette bilder for jobb ${job.id}:`, error);
      }
    }

    return { antallJobberSjekket: jobber.length, antallSlettet: slettet };
  }
);
