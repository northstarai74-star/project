import { Link } from 'react-router-dom'
import { Instagram, Facebook, MessageCircle, MapPin, Clock, Mail, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-blush-light bg-charcoal text-cream/90">
      <div className="container-app grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-serif text-xl font-semibold text-cream">
            <Sparkles className="text-gold" size={20} aria-hidden="true" />
            Self Pampering
          </div>
          <p className="mt-3 text-sm text-cream/70">
            A nail art studio and training academy dedicated to elegant, hygienic, and
            confidence-boosting nail care.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://www.instagram.com/selfpampering2022"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Self Pampering on Instagram"
              className="focus-ring rounded-full bg-cream/10 p-2 hover:bg-gold hover:text-charcoal"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              aria-label="Self Pampering on Facebook"
              className="focus-ring rounded-full bg-cream/10 p-2 hover:bg-gold hover:text-charcoal"
            >
              <Facebook size={18} />
            </a>
            <a
              href="https://wa.me/10000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Message Self Pampering on WhatsApp"
              className="focus-ring rounded-full bg-cream/10 p-2 hover:bg-gold hover:text-charcoal"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-cream">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li><Link className="hover:text-gold" to="/services">Services</Link></li>
            <li><Link className="hover:text-gold" to="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-gold" to="/academy">Academy</Link></li>
            <li><Link className="hover:text-gold" to="/verify-certificate">Verify Certificate</Link></li>
            <li><Link className="hover:text-gold" to="/booking">Book Appointment</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-cream">Visit Us</h3>
          <ul className="mt-3 space-y-3 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
              123 Rosewood Avenue, Suite 4, Lagos, Nigeria
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
              Tue – Sun, 9:00 AM – 7:00 PM
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
              <a className="hover:text-gold" href="mailto:hello@selfpampering.example">hello@selfpampering.example</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg font-semibold text-cream">Stay Polished</h3>
          <p className="mt-3 text-sm text-cream/70">
            Subscribe for seasonal nail art drops, academy enrollment dates, and studio offers.
          </p>
          <Link
            to="/contact"
            className="focus-ring mt-4 inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-gold-light"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Self Pampering. All rights reserved.
      </div>
    </footer>
  )
}
