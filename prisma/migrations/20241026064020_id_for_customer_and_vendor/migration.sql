-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_pkey" PRIMARY KEY ("user_id");
