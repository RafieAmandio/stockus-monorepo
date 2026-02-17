'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { useTranslation } from '@/lib/i18n/LanguageContext'

const stocks = [
    { ticker: 'V', name: 'Visa Inc.', gain: '+85.0%', buyPrice: '$176.70', currentPrice: '$327.00', icon: '/coin-logo/VISA-coin.png' },
    { ticker: 'FWONK', name: 'Formula One Group', gain: '+171.9%', buyPrice: '$31.50', currentPrice: '$85.80', icon: '/coin-logo/F1-Coin.png' },
    { ticker: 'ADYEN', name: 'Adyen N.V.', gain: '+106.6%', buyPrice: '$646.90', currentPrice: '$1,336.60', icon: '/coin-logo/Adyen-Coin.png' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', gain: '+141.6%', buyPrice: '$199.70', currentPrice: '$482.60', icon: '/coin-logo/Microsoft-Coin.png' },
    { ticker: 'NFLX', name: 'Netflix Inc.', gain: '+117.2%', buyPrice: '$47.50', currentPrice: '$103.20', icon: '/coin-logo/Netflix-Coin.png' },
    { ticker: 'BRK.B', name: 'Berkshire Hathaway', gain: '+291.7%', buyPrice: '$128.50', currentPrice: '$503.20', icon: '/coin-logo/BH-Coin.png' },
]

const VISIBLE_DESKTOP = 3
const totalPages = Math.ceil(stocks.length / VISIBLE_DESKTOP)

const chartPaths: Record<string, string> = {
    'V':     'M0,45 Q25,44 50,40 T100,32 T140,28 T170,20 T200,12',
    'FWONK': 'M0,52 Q30,50 55,48 T90,38 T120,22 T155,18 T200,8',
    'ADYEN': 'M0,48 Q20,46 45,42 T80,44 T110,30 T150,24 T200,10',
    'MSFT':  'M0,50 Q35,48 60,44 T95,36 T125,32 T160,18 T200,6',
    'NFLX':  'M0,55 Q25,52 40,50 T75,48 T110,35 T145,20 T200,10',
    'BRK.B': 'M0,52 Q20,50 50,46 T85,40 T115,34 T150,22 T200,5',
}

function MiniChart({ id }: { id: string }) {
    const d = chartPaths[id] || 'M0,50 Q20,48 35,42 T70,35 T100,25 T130,28 T160,15 T200,8'
    return (
        <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`chartGradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={d}
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
            />
            <path
                d={`${d} V60 H0 Z`}
                fill={`url(#chartGradient-${id})`}
            />
        </svg>
    )
}

function StockCard({ stock }: { stock: typeof stocks[0] }) {
    return (
        <div className="relative bg-white rounded-2xl border border-green-200 shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white z-0" />
            <div className="relative z-10 p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0 border border-slate-100">
                        <Image
                            src={stock.icon}
                            alt={stock.ticker}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain p-1"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold font-montserrat text-main-black">{stock.ticker}</span>
                            <span className="text-xl font-bold font-montserrat text-green-500">{stock.gain}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-montserrat truncate">{stock.name}</p>
                    </div>
                </div>
                <div className="h-16">
                    <MiniChart id={stock.ticker} />
                </div>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-montserrat">Avg Buy Price</span>
                        <span className="text-sm font-montserrat font-medium text-slate-600">{stock.buyPrice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-montserrat">Current Price</span>
                        <span className="text-sm font-montserrat font-semibold text-main-black">{stock.currentPrice}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-montserrat">Total Return</span>
                        <div className="flex items-center gap-1.5 text-green-600">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-sm font-montserrat font-bold">{stock.gain}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Build pages: each page is an array of stocks
const pages = Array.from({ length: totalPages }, (_, i) =>
    stocks.slice(i * VISIBLE_DESKTOP, (i + 1) * VISIBLE_DESKTOP)
)

// For infinite loop: [clone-last, ...real pages, clone-first]
// Track layout uses index 0 = clone of last page, 1..N = real, N+1 = clone of first
const trackPages = [pages[pages.length - 1], ...pages, pages[0]]

function PageSlide({ pageStocks, prefix }: { pageStocks: typeof stocks; prefix: string }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-shrink-0">
            {pageStocks.map((stock) => (
                <StockCard key={`${prefix}-${stock.ticker}`} stock={stock} />
            ))}
        </div>
    )
}

export function StockPerformance() {
    const { t } = useTranslation()
    // trackIndex: 0 = clone-last, 1 = page0, 2 = page1, 3 = clone-first
    const [trackIndex, setTrackIndex] = useState(1)
    const [isTransitioning, setIsTransitioning] = useState(true)
    const [isAnimating, setIsAnimating] = useState(false)
    const trackRef = useRef<HTMLDivElement>(null)

    const realPage = ((trackIndex - 1) % totalPages + totalPages) % totalPages

    const handleTransitionEnd = useCallback(() => {
        // If we landed on a clone, snap to the real page instantly
        if (trackIndex === 0) {
            setIsTransitioning(false)
            setTrackIndex(totalPages) // snap to last real page
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true)
                    setIsAnimating(false)
                })
            })
        } else if (trackIndex === totalPages + 1) {
            setIsTransitioning(false)
            setTrackIndex(1) // snap to first real page
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsTransitioning(true)
                    setIsAnimating(false)
                })
            })
        } else {
            setIsAnimating(false)
        }
    }, [trackIndex])

    const next = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setTrackIndex((i) => i + 1)
    }
    const prev = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setTrackIndex((i) => i - 1)
    }

    const goToPage = (pageIdx: number) => {
        setTrackIndex(pageIdx + 1)
    }

    return (
        <section className="bg-main-black py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="container mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16 space-y-4">
                    <ScrollReveal variant="fadeUp">
                        <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-white leading-tight">
                            {t('stockPerformance.title')} <span className="text-brand">{t('stockPerformance.titleHighlight')}</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal variant="fadeUp" delay={0.1}>
                        <p className="text-lg md:text-xl text-white/60 font-montserrat font-light max-w-2xl mx-auto">
                            {t('stockPerformance.subtitle')}
                        </p>
                    </ScrollReveal>
                </div>

                {/* Cards Carousel */}
                <ScrollReveal variant="fadeUp" delay={0.2}>
                    <div className="relative max-w-6xl mx-auto">
                        {/* Nav Buttons - hidden on mobile where cards stack, shown on lg+ where 3-col layout is used */}
                        <button
                            onClick={prev}
                            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-main-black items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={next}
                            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-main-black items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Sliding track */}
                        <div className="overflow-hidden">
                            <div
                                ref={trackRef}
                                className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]' : ''}`}
                                style={{ transform: `translateX(-${trackIndex * 100}%)` }}
                                onTransitionEnd={handleTransitionEnd}
                            >
                                {trackPages.map((pageStocks, idx) => (
                                    <PageSlide key={idx} pageStocks={pageStocks} prefix={`p${idx}`} />
                                ))}
                            </div>
                        </div>

                        {/* Dots indicator + mobile nav */}
                        <div className="flex items-center justify-center gap-3 lg:gap-2 mt-8">
                            <button
                                onClick={prev}
                                className="lg:hidden w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {pages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToPage(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === realPage ? 'bg-brand w-6' : 'bg-white/30 w-2'
                                    }`}
                                />
                            ))}
                            <button
                                onClick={next}
                                className="lg:hidden w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-95 transition-transform"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    )
}
