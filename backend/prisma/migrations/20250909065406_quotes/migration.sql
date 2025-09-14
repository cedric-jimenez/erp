-- CreateEnum
CREATE TYPE "public"."QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."quotes" (
    "id" SERIAL NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "customer_id" INTEGER,
    "customer_name" VARCHAR(200) NOT NULL,
    "customer_email" VARCHAR(200),
    "status" "public"."QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_with_tax" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."quote_lines" (
    "id" SERIAL NOT NULL,
    "quote_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "item_code" VARCHAR(50) NOT NULL,
    "item_name" VARCHAR(200) NOT NULL,
    "quantity" DECIMAL(10,3) NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "line_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "quote_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotes_number_key" ON "public"."quotes"("number");

-- CreateIndex
CREATE INDEX "quotes_number_idx" ON "public"."quotes"("number");

-- CreateIndex
CREATE INDEX "quotes_status_idx" ON "public"."quotes"("status");

-- CreateIndex
CREATE INDEX "quotes_customer_id_idx" ON "public"."quotes"("customer_id");

-- CreateIndex
CREATE INDEX "quotes_deleted_at_idx" ON "public"."quotes"("deleted_at");

-- CreateIndex
CREATE INDEX "quotes_valid_until_idx" ON "public"."quotes"("valid_until");

-- CreateIndex
CREATE INDEX "quote_lines_quote_id_idx" ON "public"."quote_lines"("quote_id");

-- CreateIndex
CREATE INDEX "quote_lines_item_id_idx" ON "public"."quote_lines"("item_id");

-- AddForeignKey
ALTER TABLE "public"."quote_lines" ADD CONSTRAINT "quote_lines_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "public"."quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."quote_lines" ADD CONSTRAINT "quote_lines_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
