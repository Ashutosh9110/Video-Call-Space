import { ProductCard } from "@/components/products/product-card"
import { ProductFilters, type ProductFilters as FiltersType } from "@/components/products/product-filters"
import { getProducts, getCategories } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ProductGridProps {
  initialFilters?: Partial<FiltersType>
}

export async function ProductGrid({ initialFilters = {} }: ProductGridProps) {
  const categories = await getCategories()
  
  const products = await getProducts({
    category: initialFilters.category,
    search: initialFilters.search,
    sort: initialFilters.sort?.split('-')[0],
    order: initialFilters.sort?.split('-')[1] as 'asc' | 'desc',
    featured: initialFilters.featured,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <ProductFilters
          categories={categories}
          onFiltersChange={async (filters) => {
            // This would be handled by client-side state in a real app
            console.log('Filters changed:', filters)
          }}
        />
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {products.products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>

            {/* Load More Button */}
            {products.pages > 1 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}