"use client";

import { useEffect, useState } from "react";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

type UserRole = "ADMIN" | "MANAGER" | "CUSTOMER" | null;

interface UserData {
  id: string;
  role: UserRole;
  email: string;
}

export default function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          throw authError;
        }

        if (!user) {
          console.log("No user found, redirecting to sign-in");
          router.push("/sign-in");
          return;
        }

        setUser(user);
        console.log("Auth user:", user);

        // Fetch user data including role
        const { data, error: dbError } = await supabase
          .from("users")
          .select("id, role, email")
          .eq("id", user.id)
          .single();

        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }

        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.error("Error details:", {
          name: (error as Error)?.name,
          message: (error as Error)?.message,
          stack: (error as Error)?.stack,
        });
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [supabase, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          {user && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Debug Info:</h2>
              <p className="text-gray-600">Auth User ID: {user.id}</p>
              <p className="text-gray-600">Auth User Email: {user.email}</p>
            </div>
          )}
          <button
            onClick={() => router.push("/sign-in")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return <div>No user data available. Please try signing in again.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                href="/dashboard"
                className="flex-shrink-0 flex items-center"
              >
                Dashboard
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {userData.email} ({userData.role || "No role assigned"}
                )
              </span>
              <SignOutButton />
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-4">
            <Link
              href="/products"
              className="text-indigo-600 hover:text-indigo-900"
            >
              View Products
            </Link>
          </div>
          {userData.role === "ADMIN" && (
            <div className="mt-4">
              <Link
                href="/admin/add-product"
                className="text-indigo-600 hover:text-indigo-900"
              >
                Add New Product
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
