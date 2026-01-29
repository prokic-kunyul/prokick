import { ProductCard } from './ProductCard'

interface Jersey {
  id: string
  team: string
  league: string
  season: string
  type: string
  price: number | string
  image: string | null
}

interface ProductListProps {
  jerseys: Jersey[]
}

export function ProductList({ jerseys }: ProductListProps) {
  if (jerseys.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-dashed border-gray-300 text-center">
        <p className="text-gray-500 text-lg">No jerseys found in database.</p>
        <p className="text-sm text-gray-400 mt-2">Try seeding the database again.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {jerseys.map((jersey) => (
        <ProductCard key={jersey.id} jersey={jersey} />
      ))}
    </div>
  )
}
