'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Separator } from "@/components/ui/separator"
import { BaseProduct, useCatalogLogic } from '../../hooks/useCatalogLogic'
import { CatalogLayout } from '../shared/CatalogLayout'
import { ProductCard, ProductCardProps } from '../ProductCard'

type GeneralProduct = BaseProduct

interface Props {
  initialProducts: GeneralProduct[]
  activeCategory: string
}

export function AccessoriesCatalog({ initialProducts, activeCategory }: Props) {
  const { 
    search, setSearch, sortBy, setSortBy, currentPage, setCurrentPage, 
    ITEMS_PER_PAGE, sortProducts, updateUrl 
  } = useCatalogLogic({ initialProducts })

  // Filters (if needed in future, currently just search)
  // For 'Lainnya', maybe 'league' field is used for 'Type' (e.g. Scarf, Hat)
  // Filters (if needed in future, currently just search)
  // Derived State
  const searchParams = useSearchParams()
  const selectedType = searchParams.get('type') || 'All'

  const types = useMemo(() => {
    const raw = initialProducts.map(j => j.league)
    return ['All', ...new Set(raw.filter(l => l && l !== '-' && l !== 'General'))].sort()
  }, [initialProducts])

  const filteredProducts = useMemo(() => {
    const result = initialProducts.filter(p => {
      const matchSearch = p.team.toLowerCase().includes(search.toLowerCase())
      const matchType = selectedType === 'All' || p.league === selectedType
      return matchSearch && matchType
    })
    return sortProducts(result)
  }, [initialProducts, search, selectedType, sortProducts])

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
             <li className="text-white font-bold text-sm">{activeCategory}</li>
          </ul>
      </div>
      
       {/* Type Filter (if available) */}
       {types.length > 1 && (
        <div>
            <Separator className="bg-white/10 mb-6" />
            <h3 className="font-medium text-white mb-4">Tipe</h3>
            <div className="space-y-2">
            {types.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input 
                    type="radio" 
                    name="type" 
                    className="hidden" 
                    checked={selectedType === type} 
                    onChange={() => {
                       updateUrl('type', type === 'All' ? '' : type)
                    }} 
                />
                <span className={`text-sm ${selectedType === type ? 'text-blue-400 font-bold' : 'text-gray-400 group-hover:text-white'}`}>{type}</span>
                </label>
            ))}
            </div>
        </div>
       )}
    </div>
  )

  return (
    <CatalogLayout
      title="Aksesoris"
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
