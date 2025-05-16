/*
  Warnings:

  - Added the required column `password` to the `Citizen` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Citizen` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Citizen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Citizen" ("address", "createdAt", "email", "id", "name", "phone", "updatedAt") SELECT "address", "createdAt", "email", "id", "name", "phone", "updatedAt" FROM "Citizen";
DROP TABLE "Citizen";
ALTER TABLE "new_Citizen" RENAME TO "Citizen";
CREATE UNIQUE INDEX "Citizen_email_key" ON "Citizen"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
