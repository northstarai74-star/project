import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGalleryImages } from '../../lib/api/gallery'
import type { GalleryImage } from '../../lib/types'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Skeleton } from '../ui/Skeleton'
import { Button } from '../ui/Button'
import { ArtTile } from '../ui/ArtTile'

export function GalleryPreview() {
  const [images, setImages] = useState<GalleryImage[] | null>(null)

  useEffect(() => {
    let active = true
    getGalleryImages().then((data) => {
      if (active) setImages(data.slice(0, 6))
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="container-app py-20">
      <SectionHeading
        eyebrow="Our Work"
        title="Gallery Highlights"
        description="A glimpse of recent nail art — bridal, 3D, seasonal, and minimal designs."
      />

      <div className="mt-12 columns-2 gap-4 sm:columns-3">
        {!images &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mb-4 h-56 w-full break-inside-avoid" />
          ))}
        {images?.map((image, i) => (
          <Reveal key={image.id} delay={i * 0.05} className="mb-4 break-inside-avoid">
            <ArtTile
              seed={image.src}
              label={image.alt}
              icon={i % 2 === 0 ? 'flower' : 'sparkle'}
              className="aspect-[4/5] w-full shadow-soft"
            />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/gallery">
          <Button variant="secondary">Browse Full Gallery</Button>
        </Link>
      </div>
    </section>
  )
}
