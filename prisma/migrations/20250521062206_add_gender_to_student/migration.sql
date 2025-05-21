-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'male';
