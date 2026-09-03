import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface LightboxProps {
  src: string
  alt: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

export function Lightbox({ src, alt, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          aria-label="Close image preview"
          className="focus-ring absolute right-4 top-4 rounded-full bg-white/10 p-2 text-cream hover:bg-white/20"
        >
          <X size={24} />
        </button>
        {onPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onPrev()
            }}
            aria-label="Previous image"
            className="focus-ring absolute left-2 sm:left-6 rounded-full bg-white/10 p-2 text-cream hover:bg-white/20"
          >
            <ChevronLeft size={28} />
          </button>
        )}
        {onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onNext()
            }}
            aria-label="Next image"
            className="focus-ring absolute right-2 sm:right-6 rounded-full bg-white/10 p-2 text-cream hover:bg-white/20"
          >
            <ChevronRight size={28} />
          </button>
        )}
        <motion.img
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          src={src}
          alt={alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-soft"
        />
      </motion.div>
    </AnimatePresence>
  )
}
