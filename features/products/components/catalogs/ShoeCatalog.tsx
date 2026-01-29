'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { BaseProduct, useCatalogLogic } from '../../hooks/useCatalogLogic'
import { CatalogLayout } from '../shared/CatalogLayout'
import { ProductCard, ProductCardProps } from '../ProductCard'

type ShoeProduct = BaseProduct

interface Props {
  initialShoes: ShoeProduct[]
}

export function ShoeCatalog({ initialShoes }: Props) {
  const { 
    search, setSearch, sortBy, setSortBy, currentPage, setCurrentPage, 
    ITEMS_PER_PAGE, sortProducts, updateUrl 
  } = useCatalogLogic({ initialProducts: initialShoes })

  const searchParams = useSearchParams()

  // Derived State
  const selectedBrand = searchParams.get('brand') || 'All'

  // Extract Brands (stored in 'league' field in DB)
  const brands = useMemo(() => {
    const raw = initialShoes.map(j => j.league)
    return ['All', ...new Set(raw.filter(l => l && l !== '-' && l !== 'General'))].sort()
  }, [initialShoes])

  // Filter Logic
  const filteredProducts = useMemo(() => {
    const result = initialShoes.filter(shoe => {
      const matchSearch = shoe.team.toLowerCase().includes(search.toLowerCase()) || 
                          (shoe.league && shoe.league.toLowerCase().includes(search.toLowerCase()))
      
      const matchBrand = selectedBrand === 'All' || shoe.league === selectedBrand

      return matchSearch && matchBrand
    })
    return sortProducts(result)
  }, [initialShoes, search, selectedBrand, sortProducts])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const Sidebar = (
    <div className="space-y-8 pb-10">
      {/* Category Links */}
      <div className="space-y-3 pb-6">
          <h3 className="font-medium text-white">Kategori</h3>
          <ul className="space-y-2">
            <li className="text-white font-bold text-sm">Sepatu Bola / Futsal</li>
          </ul>
          <Separator className="bg-white/10 mt-6" />
      </div>

      {/* Brand Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white flex items-center gap-2">
              Brand
              <span className="text-xs text-gray-500 font-normal">({brands.length})</span>
            </h3>
        </div>
        <div className="space-y-1">
          {brands.map(brand => {
            const isActive = selectedBrand === brand
            return (
            <button 
              key={brand} 
              onClick={() => {
                 updateUrl('brand', brand === 'All' ? '' : brand)
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-900/40 to-transparent text-white font-medium border-l-2 border-cyan-400' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{brand}</span>
              {isActive && (
                <Check className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <CatalogLayout
      title="Sepatu"
      search={search}
      onSearchChange={setSearch}
      sortBy={sortBy}
      onSortChange={setSortBy}
      Sidebar={Sidebar}
      filteredProductCount={filteredProducts.length}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    >
      {paginatedProducts.map(product => (
        <ProductCard key={product.id} jersey={product as unknown as ProductCardProps['jersey']} />
      ))}
    </CatalogLayout>
  )
}
