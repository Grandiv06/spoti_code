import { PrismaClient } from "@prisma/client";
import { STAFF_PHONE_ACCOUNTS } from "../src/lib/staff-accounts";

const prisma = new PrismaClient();

async function main() {
  await prisma.discountCodeUsage.deleteMany();
  await prisma.supportTicketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.courseEnrollment.deleteMany();
  await prisma.userOrder.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  for (const account of Object.values(STAFF_PHONE_ACCOUNTS)) {
    await prisma.user.create({
      data: {
        id: account.id,
        phone: account.phone,
        fullName: account.fullName,
        role: account.role,
        status: "active",
      },
    });
  }

  console.log("Users reset:");
  for (const account of Object.values(STAFF_PHONE_ACCOUNTS)) {
    console.log(`- ${account.role}: ${account.phone}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
