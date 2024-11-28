import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function testRBAC() {
  try {
    console.log("\n🔒 Testing Role Based Access Control\n");

    // Test cases for different roles and routes
    const testCases = [
      {
        email: "admin@example.com",
        expectedRole: Role.ADMIN,
        routes: ["/admin/dashboard", "/manager/products", "/profile"],
      },
      {
        email: "manager@example.com",
        expectedRole: Role.MANAGER,
        routes: ["/admin/dashboard", "/manager/products", "/profile"],
      },
      {
        email: "customer@example.com",
        expectedRole: Role.CUSTOMER,
        routes: ["/admin/dashboard", "/manager/products", "/profile"],
      },
    ];

    for (const testCase of testCases) {
      // Fetch user
      const user = await prisma.user.findUnique({
        where: { email: testCase.email },
        select: { role: true, email: true },
      });

      if (!user) {
        console.error(`❌ User not found: ${testCase.email}`);
        continue;
      }

      console.log(`\n👤 Testing ${testCase.email} (${user.role}):`);
      console.log(
        `Role check: ${user.role === testCase.expectedRole ? "✅" : "❌"}`
      );

      // Test route access
      for (const route of testCase.routes) {
        const hasAccess = await checkRouteAccess(route, user.role);
        console.log(
          `${route}: ${hasAccess ? "✅ Access Granted" : "❌ Access Denied"}`
        );
      }
    }
  } catch (error) {
    console.error("Error testing RBAC:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to check route access
function checkRouteAccess(route: string, role: Role): boolean {
  const routePermissions: Record<string, Role[]> = {
    "/admin/dashboard": [Role.ADMIN],
    "/manager/products": [Role.ADMIN, Role.MANAGER],
    "/profile": [Role.ADMIN, Role.MANAGER, Role.CUSTOMER],
  };

  const requiredRoles = Object.entries(routePermissions).find(([path]) =>
    route.startsWith(path)
  )?.[1];

  return requiredRoles ? requiredRoles.includes(role) : false;
}

testRBAC();
