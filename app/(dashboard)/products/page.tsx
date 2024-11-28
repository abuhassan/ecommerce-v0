import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { ChevronDown, Filter } from "lucide-react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Products() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: products, error } = await supabase
    .from("Product")
    .select("*, Category(name)")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }

  const categories = [
    ...new Set(
      products?.map((product) => product.Category?.name).filter(Boolean)
    ),
  ];
  const materials = [
    ...new Set(products?.map((product) => product.material).filter(Boolean)),
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Our Kitchenware Collection
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                Categories <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem key={category}>
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[180px]">
                Materials <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
              <DropdownMenuLabel>Filter by Material</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {materials.map((material) => (
                <DropdownMenuCheckboxItem key={material}>
                  {material}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Sort
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <div
            key={product.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  In stock: {product.stock}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  Material: {product.material}
                </p>
                <p className="text-sm text-gray-700">Brand: {product.brand}</p>
                <p className="text-sm text-gray-700">
                  Origin: {product.origin}
                </p>
                <p className="text-sm text-gray-700">
                  Category: {product.Category?.name}
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                {product.isNewArrival && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    New Arrival
                  </span>
                )}
                {product.isTrending && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Trending
                  </span>
                )}
              </div>
              <div className="mt-6">
                <Button className="w-full">Add to Cart</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
