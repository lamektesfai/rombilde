import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { processJob } from "@/lib/pipeline";
import { refundVippsPayment } from "@/lib/vipps";
import { sendFailureEmail } from "@/lib/email";

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
