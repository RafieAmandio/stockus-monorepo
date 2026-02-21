'use client'

import Image from 'next/image'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/LanguageContext'

const team = [
  {
    name: 'Jefta Ongkodiputra',
    role: '10+ years experiences as Investment Analyst',
    description: `A seasoned investor with over a decade of experience in hedge funds and global equities. Focused on deep fundamental research and long term quality compounding.

Coupled with university level teaching experience, Jefta brings a combination of years of real world investing and a way to distill complex information into actionable ideas and skills.`,
    image: '/jo.webp',
  },
  {
    name: 'Yosua Kho',
    role: '10+ years experiences as Investment Analyst',
    description: `A seasoned investor with over a decade of experience in hedge funds and global equities. Focused on deep fundamental research and long term quality compounding.

Coupled with university level teaching experience, Yosua brings a combination of years of real world investing and a way to distill complex information into actionable ideas and skills.`,
    image: '/jo2.webp',
  },
]


export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <main className="bg-custom-secondary min-h-screen font-montserrat">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-main-black py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-brand/10 blur-[120px]" />
          <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-brand/5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative">
          <ScrollReveal variant="fadeUp">
            <p className="text-sm font-semibold text-brand mb-4 tracking-wider uppercase">
              {t('about.heroTag')}
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-white max-w-3xl">
              {t('about.heroTitle')}
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <p className="text-main-white opacity-70 text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              {t('about.heroDescription')}
            </p>
          </ScrollReveal>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pb-16 md:pb-24">
        <ScrollReveal variant="fadeUp">
          <div className="text-center mb-10 md:mb-14">
            <p className="text-sm font-semibold text-brand mb-3 tracking-wider uppercase">
              {t('about.teamTitle')}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-main-black">
              {t('about.teamSubtitle')}
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-10 md:space-y-14">
          {team.map((member, index) => {
            const isReversed = index % 2 !== 0
            return (
              <ScrollReveal key={index} variant={isReversed ? 'fadeLeft' : 'fadeRight'} delay={index * 0.15}>
                <motion.div
                  className="bg-brand rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                    {/* Text side */}
                    <div className="w-full lg:w-1/2 p-8 md:p-10 lg:p-14 flex flex-col justify-between">
                      <div>
                        <span className="text-xs sm:text-sm font-medium tracking-[0.2em] text-white/70 uppercase">
                          {t('about.getToKnow')}
                        </span>
                        <div className="mt-5 sm:mt-6 space-y-5">
                          {member.description.split('\n\n').map((para, i) => (
                            <p key={i} className="text-white/90 text-base sm:text-lg leading-relaxed font-light">
                              {para.trim()}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="mt-8 lg:mt-10 pt-6 border-t border-white/15">
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                          {member.name}
                        </h3>
                        <p className="text-white/70 text-sm sm:text-base mt-1.5 font-light">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Image side */}
                    <div className="w-full lg:w-1/2 relative min-h-[350px] sm:min-h-[420px] lg:min-h-0">
                      <div className="absolute inset-0 lg:inset-4 lg:my-4 rounded-none lg:rounded-[20px] overflow-hidden bg-slate-200">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-top transition-transform duration-700 hover:scale-105"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </main>
  )
}
