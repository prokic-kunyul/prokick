'use client'

import { Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import * as motion from "framer-motion/client"
import { SortOption } from '../../hooks/useCatalogLogic'
import { ReactNode, useState, useEffect } from 'react'

interface CatalogLayoutProps {
  title: string
  breadcrumbs?: ReactNode
  
  // State
  search: string
  onSearchChange: (val: string) => void
  sortBy: SortOption
  onSortChange: (val: SortOption) => void
  
  // Content
  Sidebar: ReactNode
  filteredProductCount: number
  children: ReactNode // The grid of products

  // Pagination
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CatalogLayout({
  title,
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  Sidebar,
  filteredProductCount,
  children,
  currentPage,
  totalPages,
  onPageChange
}: CatalogLayoutProps) {
  const [localSearch, setLocalSearch] = useState(search)

  // Sync local state when external search prop changes (e.g. via URL or clear)
  useEffect(() => {
    setLocalSearch(search)
  }, [search])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(localSearch)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 relative min-h-screen">
      {/* Sidebar Filters - Desktop */}
      <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-32 h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-hide">
         {Sidebar}
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-[500px] flex flex-col">
        {/* Mobile Search & Controls */}
        <div className="flex flex-col gap-4 lg:hidden mb-6 sticky top-16 bg-black z-30 py-4 border-b border-white/5">
           {/* Search Bar Mobile */}
           <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder={`Search ${title}...`}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
           </div>

           <div className="flex items-center justify-between">
             <Sheet>
               <SheetTrigger asChild>
                 <button className="flex items-center gap-2 text-white font-medium border border-white/10 rounded-full px-4 py-2 text-sm hover:bg-white/5">
                   Filter 
                   <Filter className="w-4 h-4" />
                 </button>
               </SheetTrigger>
               <SheetContent side="left" className="bg-[#050A1F] border-blue-500/10 w-full max-w-[300px] z-[60] overflow-y-auto p-6">
                 <SheetHeader className="pb-6 border-b border-white/10 mb-6">
                   <SheetTitle className="text-white text-left font-bold">Filter {title}</SheetTitle>
                 </SheetHeader>
                 {Sidebar}
               </SheetContent>
             </Sheet>

             {/* Mobile Sort */}
             <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                  <SelectTrigger className="w-[140px] bg-black border-white/10 text-white text-xs h-9">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low - High</SelectItem>
                    <SelectItem value="price-high">Price: High - Low</SelectItem>
                  </SelectContent>
              </Select>
           </div>
        </div>


        {/* Desktop Toolbar (Search + Sort) */}
        <div className="hidden lg:flex items-center justify-between mb-6">
            {/* Search Bar Desktop */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder={`Search ${title}...`}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex items-center gap-3">
               <span className="text-white font-medium text-sm">Sort By:</span>
               
               <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
                <SelectTrigger className="w-[180px] bg-black border-white/10 text-white focus:ring-white/20">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="newest" className="focus:bg-white/10 focus:text-white cursor-pointer">Newest</SelectItem>
                  <SelectItem value="price-low" className="focus:bg-white/10 focus:text-white cursor-pointer">Price: Low - High</SelectItem>
                  <SelectItem value="price-high" className="focus:bg-white/10 focus:text-white cursor-pointer">Price: High - Low</SelectItem>
                  <SelectItem value="name-az" className="focus:bg-white/10 focus:text-white cursor-pointer">Name: A - Z</SelectItem>
                  <SelectItem value="name-za" className="focus:bg-white/10 focus:text-white cursor-pointer">Name: Z - A</SelectItem>
                  <SelectItem value="oldest" className="focus:bg-white/10 focus:text-white cursor-pointer">Oldest</SelectItem>
                </SelectContent>
               </Select>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {filteredProductCount > 0 ? (
            <motion.div 
               className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10"
               initial="hidden"
               animate="visible"
               variants={{
                 hidden: { opacity: 0 },
                 visible: {
                   opacity: 1,
                   transition: { staggerChildren: 0.1 }
                 }
               }}
            >
              {children}
            </motion.div>
          ) : (
            <div className="py-20 text-center">
              <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); if(currentPage > 1) onPageChange(currentPage - 1) }} 
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === i + 1}
                      onClick={(e) => { e.preventDefault(); onPageChange(i + 1) }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) onPageChange(currentPage + 1) }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
