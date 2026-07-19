import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadImageToR2(
  file: Buffer,
  contentType: string,
  keyPrefix: string
): Promise<string> {
  const key = `${keyPrefix}/${randomUUID()}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
    })
  );

  return `${process.env.R2_PUBLIC_BASE_URL}/${key}`;
}

// Sletter et objekt fra R2 gitt den offentlige URL-en det ble lastet opp med.
// Ignorerer URL-er som ikke peker til vår egen R2-bucket (f.eks. bilder hostet av Decor8 AI).
export async function deleteImageFromR2(url: string): Promise<void> {
  const publicBase = process.env.R2_PUBLIC_BASE_URL ?? "";
  if (!publicBase || !url.startsWith(publicBase)) return;

  const key = url.slice(publicBase.length).replace(/^\//, "");
  if (!key) return;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
  );
}
