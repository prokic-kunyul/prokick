'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { BaseProduct, useCatalogLogic } from '../../hooks/useCatalogLogic'
import { CatalogLayout } from '../shared/CatalogLayout'
import { ProductCard, ProductCardProps } from '../ProductCard'

// Extend BaseProduct slightly if needed, but BaseProduct is usually enough
type JerseyProduct = BaseProduct

interface Props {
  initialJerseys: JerseyProduct[]
  activeCategory?: string // 'Jersey', 'Retro', etc.
  subCategories?: string[]
}

export function JerseyCatalog({ initialJerseys, activeCategory, subCategories }: Props) {
  const { 
    search, setSearch, sortBy, setSortBy, currentPage, setCurrentPage, 
    ITEMS_PER_PAGE, sortProducts, updateUrl 
  } = useCatalogLogic({ initialProducts: initialJerseys })

  const searchParams = useSearchParams()

  // -- SPECIFIC FILTERS --
  // Derived from URL
  const catParam = searchParams.get('category')
  const shouldFilterCategory = catParam && subCategories?.includes(catParam)
  const selectedCategory = shouldFilterCategory ? catParam : (activeCategory || 'Jersey')

  const selectedLeague = searchParams.get('league') || 'All'
  const selectedSeason = searchParams.get('season') || 'All'
  
  const [isPageLoading, setIsPageLoading] = useState(false)
  
  // -- SCROLL TO TOP ON PAGE CHANGE --
  const handlePageChange = (page: number) => {
    setIsPageLoading(true)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Simulate "refresh" feel
    setTimeout(() => {
      setIsPageLoading(false)
    }, 800)
  }

  // Extract Options
  const leagues = useMemo(() => {
    const raw = initialJerseys.map(j => j.league)
    return ['All', ...new Set(raw.filter(l => l && l !== '-' && l !== 'General'))].sort()
  }, [initialJerseys])

  const seasons = useMemo(() => {
    const raw = initialJerseys.map(j => j.season)
    return ['All', ...new Set(raw.filter(s => s && s !== '-' && s !== 'General'))].sort().reverse()
  }, [initialJerseys])

  // -- FILTERING -- 
  const filteredProducts = useMemo(() => {
    const result = initialJerseys.filter(jersey => {
      // 1. Search
      const matchSearch = jersey.team.toLowerCase().includes(search.toLowerCase()) || 
                          (jersey.league && jersey.league.toLowerCase().includes(search.toLowerCase()))
      
      // 2. League
      const matchLeague = selectedLeague === 'All' || jersey.league === selectedLeague

      // 3. Season
      const matchSeason = selectedSeason === 'All' || jersey.season === selectedSeason

      // 4. Category
      // Logic: If selectedCategory is a specific sub-category (like 'Retro'), filter by it.
      // If it's the generic main category 'Jersey' (and we are in JerseyCatalog), we might show all OR specific 'Jersey'.
      // Based on previous logic, let's treat it largely as a filter if it matches a sub-category.
      
      const isFilterActive = selectedCategory && subCategories?.includes(selectedCategory)
      // const categoryMatch = !isFilterActive || (selectedCategory === 'Jersey' ? true : jersey.category === selectedCategory) 
      // Tweaked: If 'Jersey' selected, usually means "All Jerseys" including Retro/Promo? 
      // OR does user expect strictly "Category: Jersey"?
      // Let's stick to strict if consistent. If 'Jersey' is a specific category in DB, then match strictly.
      // DB has 'Jersey', 'Retro', 'Promo'. 
      // If user clicks 'Jersey' tab, they probably want 'Jersey' category items.
      const strictCategoryMatch = !isFilterActive || jersey.category === selectedCategory

      return matchSearch && matchLeague && matchSeason && strictCategoryMatch
    })

    return sortProducts(result)
  }, [initialJerseys, search, selectedLeague, selectedSeason, selectedCategory, sortProducts, subCategories])

  // -- PAGINATION --
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // -- SIDEBAR UI --
  const Sidebar = (
    <div className="space-y-8 pb-10">
      {/* Category Links (Hardcoded for Jersey context if needed, or pass props) */}
      <div className="space-y-3 pb-6">
          <h3 className="font-medium text-white">Kategori</h3>
          <ul className="space-y-2">
            {(subCategories || ['Jersey', 'Retro', 'Promo', 'New Release']).map(cat => (
              <li key={cat}>
                <button 
                onClick={() => {
                    updateUrl('category', cat) 
                }}
                className={`text-sm hover:text-gray-400 text-left w-full transition-colors ${
                  selectedCategory === cat ? 'text-blue-400 font-bold' : 'text-white font-medium'
                }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
          <Separator className="bg-white/10 mt-6" />
      </div>

      {/* League Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-white flex items-center gap-2">
              Liga
              <span className="text-xs text-gray-500 font-normal">({leagues.length})</span>
            </h3>
        </div>
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {leagues.map(league => {
            const isActive = selectedLeague === league
            return (
              <button 
                key={league} 
                onClick={() => {
                   updateUrl('league', league === 'All' ? '' : league)
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-900/40 to-transparent text-white font-medium border-l-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{league}</span>
                {isActive && (
                  <Check className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Season Filter */}
      <div className="pt-6">
        <Separator className="bg-white/10 mb-6" />
        <h3 className="font-medium text-white mb-4">Musim</h3>
        <div className="flex flex-wrap gap-2">
          {seasons.map(season => {
             const isActive = selectedSeason === season
             return (
              <button
                key={season}
                onClick={() => {
                  updateUrl('season', season === 'All' ? '' : season)
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                  isActive 
                    ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {season}
              </button>
             )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <CatalogLayout
      title="Jersey"
      search={search}
      onSearchChange={setSearch}
      sortBy={sortBy}
      onSortChange={setSortBy}
      Sidebar={Sidebar}
      filteredProductCount={filteredProducts.length}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    >
      {isPageLoading ? (
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div key={i} className="space-y-5 p-4 border border-white/10 rounded-xl bg-slate-900/50">
                  <Skeleton className="h-48 w-full rounded-lg bg-slate-800" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/5 rounded-lg bg-slate-800" />
                    <Skeleton className="h-4 w-4/5 rounded-lg bg-slate-800" />
                    <Skeleton className="h-4 w-2/5 rounded-lg bg-slate-800" />
                  </div>
                </div>
              ))}
         </div>
      ) : (
        paginatedProducts.map(product => (
          <ProductCard key={product.id} jersey={product as unknown as ProductCardProps['jersey']} />
        ))
      )}
    </CatalogLayout>
  )
}
