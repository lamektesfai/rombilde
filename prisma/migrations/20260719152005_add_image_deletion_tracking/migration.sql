-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "imagesDeletedAt" TIMESTAMP(3),
ALTER COLUMN "originalImageUrl" DROP NOT NULL;
