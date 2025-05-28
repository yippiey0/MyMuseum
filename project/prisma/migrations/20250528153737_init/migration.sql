-- CreateTable
CREATE TABLE "Exhibit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "year" INTEGER,
    "category" TEXT,
    "technicalDetails" TEXT,
    "historicalContext" TEXT
);

-- CreateTable
CREATE TABLE "HistoricalEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" TEXT,
    "description" TEXT,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "years" TEXT,
    "biography" TEXT,
    "achievements" TEXT,
    "imageUrl" TEXT
);
