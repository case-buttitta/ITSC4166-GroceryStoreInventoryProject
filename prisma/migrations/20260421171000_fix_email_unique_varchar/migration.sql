-- AlterTable: change name, email, role from CHAR to VARCHAR and add unique constraint on email
ALTER TABLE "User"
  ALTER COLUMN "name" TYPE VARCHAR(50),
  ALTER COLUMN "email" TYPE VARCHAR(50),
  ALTER COLUMN "role" TYPE VARCHAR(10);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
