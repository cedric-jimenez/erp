-- CreateTable
CREATE TABLE "public"."health_check" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ok',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."items" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "unit" VARCHAR(20) NOT NULL DEFAULT 'unité',
    "category" VARCHAR(100),
    "stock_min" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_code_key" ON "public"."items"("code");

-- CreateIndex
CREATE INDEX "items_code_idx" ON "public"."items"("code");

-- CreateIndex
CREATE INDEX "items_category_idx" ON "public"."items"("category");

-- CreateIndex
CREATE INDEX "items_active_idx" ON "public"."items"("active");

-- CreateIndex
CREATE INDEX "items_deleted_at_idx" ON "public"."items"("deleted_at");
