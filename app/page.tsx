import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to KitchenCraft
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover our curated collection of premium kitchenware for the
            modern home chef.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary bg-white border-2 border-primary hover:bg-gray-50 rounded-lg transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Carefully selected high-quality kitchenware
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Expert Curation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Products chosen by culinary experts
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quick and secure shipping worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
