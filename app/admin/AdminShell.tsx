'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LayoutDashboard, Package, Settings, ShoppingCart, MessageSquare, ArrowLeft, Menu, Image as ImageIcon, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/jerseys', label: 'Jerseys', icon: Package },
  { href: '/admin/shoes', label: 'Shoes', icon: Package },
  { href: '/admin/windbreakers', label: 'Windbreakers', icon: Package },
  { href: '/admin/accessories', label: 'Accessories', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href}
            href={item.href} 
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
              isActive 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </Link>
        )
      })}
      
      <div className="pt-8 space-y-2">
        <Link 
          href="/" 
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-blue-400 hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
        <form action={async () => {
          const { logout } = await import('@/app/actions/auth')
          await logout()
        }}>
           <button 
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-white/5 transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  )
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#111] border-b border-white/10 flex items-center px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#111] border-white/10 w-[280px] p-0">
            <SheetHeader className="p-6 border-b border-white/10">
              <SheetTitle className="text-white text-left flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">A</div>
                Admin Panel
              </SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        
        <span className="ml-4 font-bold text-lg">Admin Panel</span>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-[#111] border-r border-white/10 p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
