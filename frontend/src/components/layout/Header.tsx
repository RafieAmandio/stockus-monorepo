import Link from 'next/link'
import { NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { MobileNav } from './MobileNav'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-slate-900">{SITE_NAME}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/login">Masuk</Link>
          </Button>
          <Button size="sm" className="hidden md:inline-flex" asChild>
            <Link href="/pricing">Daftar</Link>
          </Button>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
