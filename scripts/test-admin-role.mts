import { PrismaClient } from "@prisma/client";
import { supabase } from "@/lib/supabase";

const prisma = new PrismaClient();

async function testAdminRole() {
  try {
    // Test cases for different roles
    const testCases = [
      { email: "admin@example.com", expectedRole: "ADMIN" },
      { email: "manager@example.com", expectedRole: "MANAGER" },
      { email: "customer@example.com", expectedRole: "CUSTOMER" },
    ];

    for (const testCase of testCases) {
      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { email: testCase.email },
      });

      if (!user) {
        console.error(`User not found: ${testCase.email}`);
        continue;
      }

      // Test role-based access
      const response = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log(`\nTesting ${testCase.email} (${user.role}):`);
      console.log(
        "Database access:",
        response.error ? "❌ Denied" : "✅ Granted"
      );
      console.log(
        "Role check:",
        user.role === testCase.expectedRole ? "✅ Correct" : "❌ Incorrect"
      );

      // Test protected routes based on role
      const protectedRoutes = [
        { path: "/admin/dashboard", allowedRoles: ["ADMIN"] },
        { path: "/manager/products", allowedRoles: ["ADMIN", "MANAGER"] },
        { path: "/profile", allowedRoles: ["ADMIN", "MANAGER", "CUSTOMER"] },
      ];

      for (const route of protectedRoutes) {
        const hasAccess = route.allowedRoles.includes(user.role);
        console.log(
          `${route.path}: ${
            hasAccess ? "✅ Access Granted" : "❌ Access Denied"
          }`
        );
      }
    }
  } catch (error) {
    console.error("Error testing roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminRole();
