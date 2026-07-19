import { prisma } from "@/lib/prisma";
import { furnishRoomImage, removeFurnitureFromImage } from "@/lib/ai-staging";
import { sendResultEmail } from "@/lib/email";

// Kalles fra src/inngest/functions.ts. Kaster videre ved feil slik at Inngest sin
// automatiske retry (se processJobFunction) kan prøve på nytt før jobben gis opp.
export async function processJob(jobId: string): Promise<void> {
  const job = await prisma.job.findUniqueOrThrow({ where: { id: jobId } });

  if (!job.originalImageUrl) {
    throw new Error(`Jobb ${jobId} mangler originalbilde (sannsynligvis allerede slettet)`);
  }

  await prisma.job.update({ where: { id: jobId }, data: { status: "processing" } });

  try {
    let sourceForFurnishing = job.originalImageUrl;

    if (job.roomState === "furnished") {
      const intermediateImageUrl =
        job.intermediateImageUrl ?? (await removeFurnitureFromImage(job.originalImageUrl));

      if (!job.intermediateImageUrl) {
        await prisma.job.update({ where: { id: jobId }, data: { intermediateImageUrl } });
      }

      sourceForFurnishing = intermediateImageUrl;
    }

    const resultImageUrl = await furnishRoomImage({
      imageUrl: sourceForFurnishing,
      roomType: job.roomType,
      style: job.style,
    });

    await prisma.job.update({
      where: { id: jobId },
      data: { status: "completed", resultImageUrl, completedAt: new Date() },
    });

    try {
      await sendResultEmail({ to: job.userEmail, resultImageUrl });
    } catch (emailError) {
      console.error(`Kunne ikke sende resultat-e-post for jobb ${jobId}:`, emailError);
    }
  } catch (error) {
    // Status settes IKKE til "failed" her — det ville stoppet pollingen på kvitteringssiden
    // midt i et Inngest-retry-forsøk. Endelig feil håndteres av onFailure i inngest/functions.ts.
    await prisma.job.update({
      where: { id: jobId },
      data: {
        retryCount: { increment: 1 },
        failureReason: error instanceof Error ? error.message : "Ukjent feil",
      },
    });
    throw error;
  }
}
