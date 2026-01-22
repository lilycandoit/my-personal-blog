-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Sydney',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Australia/Sydney';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Sydney',
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Australia/Sydney';
