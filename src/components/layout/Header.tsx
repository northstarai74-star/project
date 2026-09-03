import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/academy', label: 'Academy' },
  { to: '/verify-certificate', label: 'Verify Certificate' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-blush-light bg-cream/90 backdrop-blur-md">
      <div className="container-app flex h-20 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-serif text-2xl font-semibold text-charcoal" onClick={() => setOpen(false)}>
          <Sparkles className="text-gold" size={22} aria-hidden="true" />
          Self Pampering
        </NavLink>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'focus-ring rounded text-sm font-medium text-charcoal/80 transition-colors hover:text-gold-dark',
                  isActive && 'text-gold-dark',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/booking"
            className="focus-ring rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-charcoal/90"
          >
            Book Appointment
          </NavLink>
        </nav>

        <button
          className="focus-ring rounded-lg p-2 text-charcoal lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-blush-light bg-cream px-4 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'focus-ring block rounded-lg px-3 py-3 text-base font-medium text-charcoal/80',
                      isActive && 'bg-blush-light text-gold-dark',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <NavLink
                to="/booking"
                onClick={() => setOpen(false)}
                className="focus-ring block rounded-full bg-charcoal px-5 py-3 text-center text-base font-semibold text-cream"
              >
                Book Appointment
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
