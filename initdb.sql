-- CreateTable
CREATE TABLE "Poi" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "Poi_pkey" PRIMARY KEY ("id")
);
