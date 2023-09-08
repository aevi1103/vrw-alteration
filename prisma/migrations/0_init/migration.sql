-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" VARCHAR,

    CONSTRAINT "categoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category_id" UUID NOT NULL,
    "service" VARCHAR NOT NULL,
    "price" REAL NOT NULL,

    CONSTRAINT "prices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "prices" ADD CONSTRAINT "prices_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

