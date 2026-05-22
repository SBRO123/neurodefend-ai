'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, LayoutDashboard, Search, BarChart3, BookOpen, Menu, X, Bell, User, Puzzle } from 'lucide-react'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scan', label: 'Scan', icon: Search },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/extension', label: 'Extension', icon: Puzzle },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="font-bold text-white">NeuroDefend<span className="text-cyan-400"> AI</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                pathname === href ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            <User className="w-4 h-4" />
          </Link>
          <Link href="/scan" className="hidden md:flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm rounded-lg transition-all">
            <Search className="w-4 h-4" /> Scan Now
          </Link>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                pathname === href ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-400'
              }`}>
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
