export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="border-b border-blush-light bg-blush-light/50 py-16">
      <div className="container-app text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">{eyebrow}</p>
        <h1 className="font-serif text-4xl font-semibold text-charcoal sm:text-5xl">{title}</h1>
        {description && <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">{description}</p>}
      </div>
    </section>
  )
}
