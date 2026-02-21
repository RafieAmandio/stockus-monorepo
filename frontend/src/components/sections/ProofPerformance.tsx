'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { useTranslation } from '@/lib/i18n/LanguageContext'
import { TrendingUp, ShieldCheck, Globe } from 'lucide-react'

export function ProofPerformance() {
  const { t } = useTranslation()

  const stats = [
    { icon: TrendingUp, label: t('proof.stat1Label'), value: t('proof.stat1Value') },
    { icon: Globe, label: t('proof.stat2Label'), value: t('proof.stat2Value') },
    { icon: ShieldCheck, label: t('proof.stat3Label'), value: t('proof.stat3Value') },
  ]

  return (
    <section className="relative py-20 md:py-28 bg-main-black overflow-hidden">
      {/* SVG mesh background */}
      <div className="absolute inset-0 z-0 opacity-[0.07]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="proof-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#F96E00" strokeWidth="1" />
            </pattern>
            <pattern id="proof-dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#F96E00" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#proof-grid)" />
          <rect width="100%" height="100%" fill="url(#proof-dots)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <ScrollReveal variant="fadeUp">
          <p className="text-sm font-semibold text-brand mb-4 tracking-wider uppercase font-montserrat text-center">
            {t('hero.proofLabel')}
          </p>
        </ScrollReveal>
        <ScrollReveal variant="fadeUp" delay={0.05}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center max-w-2xl mx-auto leading-tight">
            {t('proof.title')}
          </h2>
        </ScrollReveal>
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <p className="text-white/60 text-sm sm:text-base text-center max-w-xl mx-auto mt-4 leading-relaxed font-light">
            {t('proof.subtitle')}
          </p>
        </ScrollReveal>

        {/* Image */}
        <ScrollReveal variant="fadeUp" delay={0.15}>
          <div className="relative mt-10 md:mt-14">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand/20 via-brand/10 to-brand/20 rounded-2xl blur-xl" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-sm p-2 sm:p-3">
              <Image
                src="/proof.png"
                alt="Real portfolio performance"
                width={1200}
                height={300}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Stats row */}
        <ScrollReveal variant="fadeUp" delay={0.25}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 md:mt-14">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 px-4 py-5 rounded-xl border border-white/5 bg-white/[0.03]">
                <stat.icon className="w-5 h-5 text-brand mb-1" />
                <span className="text-xl sm:text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-xs sm:text-sm text-white/50 font-light">{stat.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Disclaimer */}
        <ScrollReveal variant="fadeUp" delay={0.3}>
          <p className="text-white/30 text-[11px] text-center mt-8 max-w-lg mx-auto leading-relaxed">
            {t('proof.disclaimer')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
