"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";

export default function VerifyEmail() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.logo size={24} />
            <span>Check your email</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-muted-foreground">
            We&apos;ve sent you a verification link. Please check your email and
            click the link to verify your account.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email?{" "}
            <Link
              href="/sign-up"
              className="text-primary underline-offset-4 hover:underline"
            >
              Try signing up again
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
