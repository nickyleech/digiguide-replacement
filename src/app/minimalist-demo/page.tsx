'use client'

import MinimalistHero from '@/components/MinimalistHero'

export default function MinimalistDemo() {
  const handleCtaClick = () => {
    window.location.href = '/guide'
  }

  return (
    <MinimalistHero
      title="Elegant Television"
      subtitle="Refined viewing experience"
      description="Where sophisticated design meets premium television programming. Every detail crafted for the discerning viewer who appreciates the art of simplicity."
      ctaText="Experience Now"
      onCtaClick={handleCtaClick}
    />
  )
}