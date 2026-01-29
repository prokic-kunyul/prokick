'use client'

import * as React from "react"
import Link from "next/link"
import { Shirt, Wind, Trophy, Star } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function MainNavigation() {
  const isMobile = useIsMobile()

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap gap-1">
        
        {/* JERSEY DROPDOWN */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-cyan-400 hover:bg-white/5 data-[state=open]:bg-white/5 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            JERSEY
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-[#050A1F]/95 backdrop-blur-xl border border-blue-500/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/10 to-transparent p-6 no-underline outline-none select-none border border-blue-500/10 hover:border-cyan-400/30 transition-all group"
                    href="/jersey"
                  >
                    <Shirt className="h-8 w-8 text-cyan-400 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    <div className="mb-2 text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      Koleksi Jersey
                    </div>
                    <p className="text-sm leading-tight text-blue-200/60">
                      Jelajahi koleksi lengkap kit autentik musim 2024/25 dari seluruh dunia.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/jersey?sort=newest" title="Rilis Terbaru" icon={<Star className="w-4 h-4 text-yellow-400" />}>
                Jersey terbaru yang baru saja mendarat.
              </ListItem>
              <ListItem href="/jersey?category=Retro" title="Retro & Klasik" icon={<Trophy className="w-4 h-4 text-purple-400" />}>
                Kembalikan kenangan masa kejayaan.
              </ListItem>
              <ListItem href="/jersey?price=low" title="Best Deals" icon={<div className="text-green-400 font-bold text-xs">$$$</div>}>
                Penawaran terbaik untuk budget Anda.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* SEPATU DROPDOWN */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-cyan-400 hover:bg-white/5 data-[state=open]:bg-white/5 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            SEPATU
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-[#050A1F]/95 backdrop-blur-xl border border-blue-500/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
               <li className="col-span-2 pb-2 border-b border-white/10 mb-1">
                   <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-widest pl-2">Kategori Sepatu</h4>
               </li>
              <ListItem href="/sepatu?category=Sepatu" title="Sepatu Bola (FG)">
                Dominasi lapangan hijau dengan grip maksimal.
              </ListItem>
              <ListItem href="/sepatu?category=Sepatu Futsal" title="Sepatu Futsal (IC)">
                Kontrol presisi untuk lapangan indoor.
              </ListItem>
              <ListItem href="/sepatu?brand=Nike" title="Nike Mercurial">
                Kecepatan eksplosif untuk penyerang.
              </ListItem>
              <ListItem href="/sepatu?brand=Adidas" title="Adidas Predator">
                Akurasi tendangan yang mematikan.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* WINDBREAKER & APPAREL */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-cyan-400 hover:bg-white/5 data-[state=open]:bg-white/5 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            WINDBREAKER
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-[#050A1F]/95 backdrop-blur-xl border border-blue-500/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-purple-500/10 to-transparent p-6 no-underline outline-none select-none border border-purple-500/10 hover:border-purple-400/30 transition-all group"
                    href="/windbreaker"
                  >
                    <Wind className="h-8 w-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <div className="mb-2 text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                      Windbreaker
                    </div>
                    <p className="text-sm leading-tight text-blue-200/60">
                      Jaket pelindung angin dan hujan, stylish di dalam dan luar stadion.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/windbreaker?type=Jacket" title="Trainkit & Jacket">
                Kenyamanan saat latihan maupun santai.
              </ListItem>
              <ListItem href="/windbreaker?team=Manchester United" title="MU Windbreaker">
                Koleksi eksklusif Setan Merah.
              </ListItem>
              <ListItem href="/windbreaker?sort=popular" title="Terlaris">
                Pilihan favorit suporter.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* AKSESORIS */}
        <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/lainnya" className={`${navigationMenuTriggerStyle()} bg-transparent text-white/80 hover:text-cyan-400 hover:bg-white/5 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]`}>
                AKSESORIS
              </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>

        {/* LIGA (Leagues) - Still useful to have direct access */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-white/80 hover:text-cyan-400 hover:bg-white/5 data-[state=open]:bg-white/5 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
            LIGA
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-[#050A1F]/95 backdrop-blur-xl border border-blue-500/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
              <ListItem href="/piala-dunia" title="WORLD CUP 2026" icon={<span className="text-xl animate-pulse">🏆</span>}>
                 <span className="text-yellow-400 font-bold">Official Merchandise</span>
              </ListItem>
              <ListItem href="/jersey?league=Premier League" title="Premier League" icon={<span className="text-lg">🦁</span>} />
              <ListItem href="/jersey?league=La Liga" title="La Liga" icon={<span className="text-lg">🇪🇸</span>} />
              <ListItem href="/jersey?league=Serie A" title="Serie A" icon={<span className="text-lg">🇮🇹</span>} />
              <ListItem href="/jersey?league=Bundesliga" title="Bundesliga" icon={<span className="text-lg">🇩🇪</span>} />
              <ListItem href="/products?category=national" title="Tim Nasional" icon={<span className="text-lg">🌍</span>} />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* HIGHLIGHT LINK */}
        <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/piala-dunia" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-yellow-400 hover:text-yellow-300 transition-colors hover:bg-white/5 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                🏆 WORLD CUP
              </Link>
            </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; icon?: React.ReactNode }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-500/10 hover:text-cyan-400 focus:bg-blue-500/10 focus:text-cyan-400 group flex items-start gap-3"
        >
          {icon && <div className="mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>}
          <div>
            <div className="text-sm font-bold leading-none text-white group-hover:text-cyan-400 transition-colors">{title}</div>
            {children && (
                <p className="line-clamp-2 text-xs leading-snug text-blue-200/50 group-hover:text-blue-200/80 mt-1.5">
                {children}
                </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
