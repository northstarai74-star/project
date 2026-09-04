import { useEffect } from 'react'
import { Hero } from '../components/home/Hero'
import { Highlights } from '../components/home/Highlights'
import { ServicesPreview } from '../components/home/ServicesPreview'
import { ExtensionSlideshow } from '../components/home/ExtensionSlideshow'
import { GalleryPreview } from '../components/home/GalleryPreview'
import { Testimonials } from '../components/home/Testimonials'
import { CertificateTeaser } from '../components/home/CertificateTeaser'
import { NewsletterCta } from '../components/home/NewsletterCta'

export function Home() {
  useEffect(() => {
    document.title = 'Self Pampering | Nail Art Studio & Training Academy'
  }, [])

  return (
    <>
      <Hero />
      <Highlights />
      <ServicesPreview />
      <ExtensionSlideshow />
      <GalleryPreview />
      <Testimonials />
      <CertificateTeaser />
      <NewsletterCta />
    </>
  )
}
