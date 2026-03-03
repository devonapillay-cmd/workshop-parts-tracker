-- CreateTable
CREATE TABLE "PartRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "partName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'NEEDED',
    "supplier" TEXT,
    "jobRef" TEXT,
    "customerName" TEXT,
    "priceEstimate" DECIMAL,
    "notes" TEXT
);
