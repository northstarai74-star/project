import { useEffect, useState } from 'react'
import { getGalleryImages } from '../lib/api/gallery'
import type { GalleryImage } from '../lib/types'
import { PageHeader } from '../components/ui/PageHeader'
import { Skeleton } from '../components/ui/Skeleton'
import { Reveal } from '../components/ui/Reveal'
import { Lightbox } from '../components/ui/Lightbox'

const CATEGORIES: Array<GalleryImage['category'] | 'All'> = [
  'All',
  'Bridal',
  '3D Art',
  'Seasonal',
  'Minimal',
]

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[] | null>(null)
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>('All')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Gallery | Self Pampering'
    getGalleryImages().then(setImages)
  }, [])

  const visible = images?.filter((img) => filter === 'All' || img.category === filter) ?? []

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Nail Art Gallery"
        description="Browse recent work across bridal, 3D, seasonal, and minimal designs. Tap any image to view it larger."
      />

      <section className="container-app py-16">
        <div className="mb-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter gallery by category">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`focus-ring rounded-full px-5 py-2 text-sm font-semibold transition ${
                filter === cat
                  ? 'bg-charcoal text-cream'
                  : 'bg-blush-light text-charcoal hover:bg-blush'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
          {!images &&
            Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="mb-4 h-60 w-full break-inside-avoid" />
            ))}
          {visible.map((image, i) => (
            <Reveal key={image.id} delay={(i % 6) * 0.05} className="mb-4 break-inside-avoid">
              <button
                onClick={() => setActiveIndex(i)}
                className="focus-ring block w-full overflow-hidden rounded-2xl shadow-soft"
                aria-label={`View larger image: ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  width={600}
                  height={750}
                />
              </button>
            </Reveal>
          ))}
        </div>
        {images && visible.length === 0 && (
          <p className="py-16 text-center text-charcoal/60">No images in this category yet.</p>
        )}
      </section>

      {activeIndex !== null && visible[activeIndex] && (
        <Lightbox
          src={visible[activeIndex].src}
          alt={visible[activeIndex].alt}
          onClose={() => setActiveIndex(null)}
          onPrev={() => setActiveIndex((i) => (i! - 1 + visible.length) % visible.length)}
          onNext={() => setActiveIndex((i) => (i! + 1) % visible.length)}
        />
      )}
    </>
  )
}
