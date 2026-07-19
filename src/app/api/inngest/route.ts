import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { cleanupOldImagesFunction, processJobFunction } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processJobFunction, cleanupOldImagesFunction],
});
