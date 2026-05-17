-- Run: npx prisma db push --accept-data-loss
-- Or apply manually if pooler is unavailable

ALTER TABLE "Hall" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Hall" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Hall" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Hall" ADD COLUMN IF NOT EXISTS "adminId" INTEGER;

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "requesterName" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "purposeCategory" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "startTime" TEXT NOT NULL DEFAULT '08:00';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "endTime" TEXT NOT NULL DEFAULT '10:00';
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "isPriority" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Hall" DROP CONSTRAINT IF EXISTS "Hall_adminId_fkey";
ALTER TABLE "Hall" ADD CONSTRAINT "Hall_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DROP INDEX IF EXISTS "Booking_hallId_bookingDate_key";
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_hallId_bookingDate_startTime_key"
  ON "Booking"("hallId", "bookingDate", "startTime");
