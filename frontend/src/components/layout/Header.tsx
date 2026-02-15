'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { MobileNav } from './MobileNav'
import Image from 'next/image'

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Get the hero section height to know when to switch
      const hero = document.querySelector('[data-hero]')
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom
        setScrolled(heroBottom <= 80)
      } else {
        // No hero on this page, always use white/scrolled style
        setScrolled(true)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 w-full py-3 transition-colors duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b'
          : 'bg-main-black'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={scrolled ? '/stockus_black.png' : '/stockus.webp'}
            alt="StockUs Logo"
            width={100}
            height={40}
            className="drop-shadow-sm"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand'
                    : scrolled
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="hidden md:inline-flex rounded-[20px] border text-brand border-brand"
            asChild
          >
            <Link href="/login" className="font-montserrat font-light">Login</Link>
          </Button>
          <Button
            size="lg"
            variant="brand"
            className="hidden md:inline-flex rounded-[20px]"
            asChild
          >
            <Link href="/pricing" className="font-montserrat font-light">Sign Up</Link>
          </Button>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
