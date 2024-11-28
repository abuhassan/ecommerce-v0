import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create test users with different roles
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: "admin123",
      role: Role.ADMIN,
      clerkId: "user_admin_" + Math.random().toString(36).substr(2, 9),
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@example.com",
      name: "Manager User",
      password: "manager123",
      role: Role.MANAGER,
      clerkId: "user_manager_" + Math.random().toString(36).substr(2, 9),
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Customer User",
      password: "customer123",
      role: Role.CUSTOMER,
      clerkId: "user_customer_" + Math.random().toString(36).substr(2, 9),
    },
  });

  console.log("Seeded users:", { admin, manager, customer });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
