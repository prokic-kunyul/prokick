
import { useSearchParams, useRouter } from 'next/navigation'

export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name-az' | 'name-za'
const ITEMS_PER_PAGE = 9

export interface BaseProduct {
  id: string
  team: string
  league: string
  season: string
  price: number | string
  category?: string
  [key: string]: unknown
}

interface UseCatalogLogicProps<T extends BaseProduct> {
  initialProducts: T[]
  defaultSort?: SortOption
}

export function useCatalogLogic<T extends BaseProduct>({ 
  defaultSort = 'newest' 
}: UseCatalogLogicProps<T>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // -- STATE --
  // Derive state directly from URL query params
  const search = searchParams.get('search') || ''
  const sortBy = (searchParams.get('sort') || defaultSort) as SortOption
  const currentPage = parseInt(searchParams.get('page') || '1')

  // -- URL UPDATER --
  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset page on filter change (except when changing page itself)
    if (key !== 'page') {
      params.set('page', '1')
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.replace(newUrl, { scroll: false })
  }

  // Helper setters for compatibility with existing components
  const setSearch = (val: string | ((prev: string) => string)) => {
    const newVal = typeof val === 'function' ? val(search) : val
    updateUrl('search', newVal)
  }

  const setSortBy = (val: SortOption | ((prev: SortOption) => SortOption)) => {
    const newVal = typeof val === 'function' ? val(sortBy) : val
    updateUrl('sort', newVal)
  }

  const setCurrentPage = (val: number | ((prev: number) => number)) => {
    const newVal = typeof val === 'function' ? val(currentPage) : val
    updateUrl('page', newVal.toString())
  }

  // -- BASE FILTERING (Search Only) --
  // Note: Specialized filtering (Season, League, etc.) should be done in the component 
  // utilizing this hook, passing the filtered list into the pagination logic if needed,
  // OR we pass filter callbacks here. For simplicity, we'll return the helper states 
  // and let the component do the specific filtering before pagination.
  
  const sortProducts = (products: T[]) => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => Number(a.price) - Number(b.price))
      case 'price-high':
        return [...products].sort((a, b) => Number(b.price) - Number(a.price))
      case 'name-az':
        return [...products].sort((a, b) => a.team.localeCompare(b.team))
      case 'name-za':
        return [...products].sort((a, b) => b.team.localeCompare(a.team))
      case 'oldest':
        return [...products].reverse()
      default: // 'newest'
        return products
    }
  }

  return {
    search,
    setSearch,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    updateUrl,
    sortProducts,
    ITEMS_PER_PAGE
  }
}
