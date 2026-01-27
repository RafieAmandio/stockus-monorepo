import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Pelajari lebih lanjut tentang StockUs, misi kami, dan tim di balik platform pendidikan investasi untuk investor Indonesia.',
  openGraph: {
    title: 'Tentang Kami | StockUs',
    description: 'Pelajari lebih lanjut tentang StockUs, misi kami, dan tim di balik platform pendidikan investasi untuk investor Indonesia.',
  },
}

const teamMembers = [
  {
    name: 'Jefta Linus',
    role: 'Founder',
    bio: 'Passionate about democratizing investment education for Indonesian investors. With years of experience in global equity markets, Jefta founded StockUs to bridge the knowledge gap and empower retail investors.',
    image: '/team/jefta.jpg',
  },
  {
    name: 'Yosua Heriel',
    role: 'Co-Founder',
    bio: 'Expert in financial research and data analysis. Yosua brings deep expertise in equity valuation and portfolio construction, helping members make informed investment decisions.',
    image: '/team/yosua.jpg',
  },
]

const values = [
  {
    title: 'Education First',
    description: 'We believe in empowering investors through structured, high-quality education that builds real understanding.',
  },
  {
    title: 'Community Driven',
    description: 'Learning happens best together. Our community fosters collaboration, discussion, and shared growth.',
  },
  {
    title: 'Practical Approach',
    description: 'Theory meets practice. We provide actionable frameworks, templates, and research you can use immediately.',
  },
]

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': teamMembers.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.role,
      description: member.bio,
      worksFor: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="border-b bg-gradient-to-b from-slate-50 to-white px-6 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Tentang StockUs
            </h1>
            <p className="text-lg text-slate-600 md:text-xl">
              Platform pendidikan investasi saham global untuk investor Indonesia
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Misi Kami</h2>
            <div className="space-y-6 text-lg leading-relaxed text-slate-700">
              <p>
                StockUs didirikan dengan misi untuk memberikan akses pendidikan investasi saham global
                yang terstruktur dan berkualitas tinggi kepada investor Indonesia. Kami percaya bahwa
                setiap investor berhak mendapatkan pengetahuan dan alat yang tepat untuk membuat keputusan
                investasi yang informed.
              </p>
              <p>
                Melalui program cohort-based learning, riset mendalam, template praktis, dan komunitas
                profesional, kami membantu investor retail membangun pemahaman fundamental tentang pasar
                saham global dan menerapkannya dalam strategi investasi mereka.
              </p>
              <p>
                Kami tidak hanya mengajarkan teori, tetapi juga memberikan framework dan tools yang dapat
                langsung diterapkan. Dari analisis fundamental hingga konstruksi portfolio, setiap materi
                dirancang untuk memberikan value praktis yang nyata.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="border-y bg-slate-50 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold">Tim Kami</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {teamMembers.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <CardHeader>
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{member.name}</CardTitle>
                        <p className="mt-1 text-sm text-slate-600">{member.role}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-slate-700">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold">Nilai-Nilai Kami</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-slate-700">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
