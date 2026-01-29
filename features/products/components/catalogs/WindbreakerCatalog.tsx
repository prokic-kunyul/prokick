'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { BaseProduct, useCatalogLogic } from '../../hooks/useCatalogLogic'
import { CatalogLayout } from '../shared/CatalogLayout'
import { ProductCard, ProductCardProps } from '../ProductCard'

type WindbreakerProduct = BaseProduct

interface Props {
  initialProducts: WindbreakerProduct[]
}

export function WindbreakerCatalog({ initialProducts }: Props) {
  const { 
    search, setSearch, sortBy, setSortBy, currentPage, setCurrentPage, 
    ITEMS_PER_PAGE, sortProducts, updateUrl 
  } = useCatalogLogic({ initialProducts })

  const searchParams = useSearchParams()

  // Derived State
  const selectedBrand = searchParams.get('brand') || 'All'

  const brands = useMemo(() => {
    const raw = initialProducts.map(j => j.league)
    return ['All', ...new Set(raw.filter(l => l && l !== '-' && l !== 'General'))].sort()
  }, [initialProducts])

  const filteredProducts = useMemo(() => {
    const result = initialProducts.filter(p => {
      const matchSearch = p.team.toLowerCase().includes(search.toLowerCase()) || 
                          (p.league && p.league.toLowerCase().includes(search.toLowerCase()))
      
      const matchBrand = selectedBrand === 'All' || p.league === selectedBrand
      return matchSearch && matchBrand
    })
    return sortProducts(result)
  }, [initialProducts, search, selectedBrand, sortProducts])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const Sidebar = (
    <div className="space-y-8 pb-10">
      <div className="space-y-3 pb-6">
          <h3 className="font-medium text-white">Kategori</h3>
          <ul className="space-y-2">
            <li className="text-white font-bold text-sm">Windbreaker & Jackets</li>
          </ul>
          <Separator className="bg-white/10 mt-6" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white">Brand / Club</h3>
        </div>
        <div className="space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                selectedBrand === brand ? 'bg-white border-white text-black' : 'border-white/10 group-hover:border-white'
              }`}>
                {selectedBrand === brand && <Check className="w-3 h-3" />}
              </div>
              <input 
                type="radio" 
                name="brand" 
                className="hidden" 
                checked={selectedBrand === brand} 
                onChange={() => {
                   updateUrl('brand', brand === 'All' ? '' : brand)
                }} 
              />
              <span className={`text-sm ${selectedBrand === brand ? 'text-white font-medium' : 'text-gray-400 group-hover:text-white'}`}>{brand}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <CatalogLayout
      title="Windbreaker"
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
