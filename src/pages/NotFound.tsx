import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | Self Pampering'
  }, [])

  return (
    <section className="container-app flex flex-col items-center gap-4 py-32 text-center">
      <p className="font-serif text-6xl font-bold text-gold-dark">404</p>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Page Not Found</h1>
      <p className="text-charcoal/70">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button className="mt-2">Back to Home</Button>
      </Link>
    </section>
  )
}
