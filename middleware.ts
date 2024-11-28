import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

// Initialize Prisma with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

const routePermissions: Record<string, Role[]> = {
  "/admin": [Role.ADMIN],
  "/manager": [Role.ADMIN, Role.MANAGER],
  "/profile": [Role.ADMIN, Role.MANAGER, Role.CUSTOMER],
};

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth.protect();

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const path = req.nextUrl.pathname;
    const requiredRoles = Object.entries(routePermissions).find(([route]) =>
      path.startsWith(route)
    )?.[1];

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  } finally {
    await prisma.$disconnect();
  }
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/profile/:path*",
    "/((?!.+\\.[\\w]+$|_next|sign-in|sign-up).*)",
  ],
};
