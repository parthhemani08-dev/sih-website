const ArrowUpRight = () => (
  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const ArrowRight = () => (
  <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
    <path d="M2.5 8h10M9 4.5 12.5 8 9 11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

const Check = () => (
  <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
    <path d="m3 8.2 3.1 3.1L13 4.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </svg>
);

const features = [
  {
    number: "01",
    title: "See what matters",
    text: "Turn scattered signals into a clear, shared picture of what your community needs next.",
  },
  {
    number: "02",
    title: "Move together",
    text: "Bring citizens, local leaders, and changemakers into one simple space for action.",
  },
  {
    number: "03",
    title: "Measure the change",
    text: "Make progress visible with insights that show where every small step leads.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="grid-paper relative min-h-[680px] border-b border-forest/10">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-mint/60 blur-3xl" />
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
          <a href="#" className="flex items-center gap-2.5" aria-label="Nirvana home">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">N</span>
            <span className="text-lg font-bold tracking-[0.18em] text-ink">NIRVANA</span>
          </a>
          <div className="hidden items-center gap-9 text-sm text-ink/70 md:flex">
            <a className="transition hover:text-forest" href="#vision">Our vision</a>
            <a className="transition hover:text-forest" href="#how-it-works">How it works</a>
            <a className="transition hover:text-forest" href="#impact">Impact</a>
          </div>
          <a href="#join" className="flex items-center gap-2 rounded-full border border-forest/20 px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white">
            Join the movement <ArrowUpRight />
          </a>
        </nav>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-32 lg:pt-20">
          <div>
            <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-forest">
              <span className="h-2 w-2 rounded-full bg-signal" />
              Smart India Hackathon · 2025
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-7xl lg:text-[5.7rem]">
              A better future starts <span className="text-forest">together.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-ink/65">
              NIRVANA turns local insight into collective action — helping communities become more aware, more prepared, and more connected.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#join" className="flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink">
                Discover NIRVANA <ArrowRight />
              </a>
              <a href="#how-it-works" className="flex items-center gap-2 px-3 py-3.5 text-sm font-semibold text-forest transition hover:gap-3">
                See how it works <ArrowRight />
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-[370px] w-full max-w-[480px] sm:h-[470px]">
            <div className="absolute inset-x-10 top-12 h-72 rounded-[45%] bg-mint/80 blur-2xl sm:inset-x-0 sm:h-96" />
            <div className="hero-orb absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-56 sm:w-56">
              <span className="absolute -right-8 top-8 h-4 w-4 rounded-full bg-white/80" />
            </div>
            <div className="absolute left-0 top-20 rounded-2xl border border-white/90 bg-white/75 p-4 shadow-soft backdrop-blur-sm sm:left-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">Connected</p>
              <p className="mt-1 text-2xl font-semibold text-forest">12,480 <span className="text-sm font-normal text-ink/50">people</span></p>
            </div>
            <div className="absolute bottom-14 right-0 rounded-2xl border border-white/90 bg-white/75 p-4 shadow-soft backdrop-blur-sm sm:right-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-forest" />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/45">Collective impact</p>
              </div>
              <p className="text-2xl font-semibold text-ink">+38.6%</p>
            </div>
            <div className="absolute bottom-3 left-1/2 h-16 w-px -translate-x-1/2 bg-forest/25" />
            <div className="absolute bottom-0 left-1/2 h-2 w-32 -translate-x-1/2 rounded-full bg-forest/20 blur-sm" />
          </div>
        </div>
      </section>

      <section id="vision" className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.75fr_1.25fr] lg:px-10 lg:py-32">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest">Why NIRVANA</p>
          <h2 className="mt-5 max-w-sm text-4xl font-semibold leading-tight tracking-[-0.04em] text-ink">Progress is a shared language.</h2>
        </div>
        <div>
          <p className="max-w-2xl text-2xl leading-relaxed tracking-[-0.02em] text-ink/75 sm:text-3xl">
            The strongest solutions are already around us. NIRVANA helps communities find them, build on them, and make them last.
          </p>
          <div className="mt-10 grid gap-4 border-t border-forest/15 pt-8 sm:grid-cols-2">
            <p className="flex gap-3 text-sm leading-6 text-ink/65"><Check /> Human-centred by design</p>
            <p className="flex gap-3 text-sm leading-6 text-ink/65"><Check /> Built for every community</p>
            <p className="flex gap-3 text-sm leading-6 text-ink/65"><Check /> Insight you can act on</p>
            <p className="flex gap-3 text-sm leading-6 text-ink/65"><Check /> Open to everyone</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-forest px-6 py-24 text-white lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 border-b border-white/20 pb-12 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-mint">A simple path forward</p>
              <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">From awareness to action.</h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/65">One shared space to understand your place, your people, and your potential.</p>
          </div>
          <div className="grid divide-y divide-white/20 md:grid-cols-3 md:divide-x md:divide-y-0">
            {features.map((feature) => (
              <article key={feature.number} className="py-9 md:px-8 md:py-12 first:md:pl-0 last:md:pr-0">
                <p className="text-sm font-semibold text-signal">{feature.number}</p>
                <h3 className="mt-16 text-2xl font-semibold tracking-[-0.03em]">{feature.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.1fr] lg:px-10 lg:py-32">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-forest">The NIRVANA effect</p>
          <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-5xl">Small signals. Big shifts.</h2>
          <p className="mt-6 max-w-md leading-7 text-ink/60">We’re creating the foundation for a future where no good idea gets lost and no one has to solve a challenge alone.</p>
          <a className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-forest hover:gap-3" href="#join">Explore our approach <ArrowRight /></a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <div className="rounded-3xl bg-mint p-6 sm:p-8"><p className="text-4xl font-semibold tracking-[-0.05em] text-forest sm:text-5xl">01</p><p className="mt-14 text-sm leading-6 text-ink/65">Listen deeply to the people who know their communities best.</p></div>
          <div className="mt-10 rounded-3xl bg-signal p-6 sm:p-8 sm:mt-16"><p className="text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">∞</p><p className="mt-14 text-sm leading-6 text-ink/65">Possibilities unlocked when we make room for every voice.</p></div>
        </div>
      </section>

      <section id="join" className="mx-6 mb-6 rounded-[2rem] bg-ink px-6 py-20 text-center text-white sm:px-10 lg:mx-10 lg:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-signal">Be part of the change</p>
        <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-6xl">There’s a place for your idea here.</h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-white/60">NIRVANA is just getting started. Follow our journey as we build a more connected India, one community at a time.</p>
        <a href="mailto:hello@nirvana.community" className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-mint">Say hello <ArrowUpRight /></a>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-xs text-ink/45 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p className="font-bold tracking-[0.18em] text-ink/65">NIRVANA</p>
        <p>Designed for a smarter, kinder tomorrow.</p>
        <p>© 2025 NIRVANA team</p>
      </footer>
    </main>
  );
}
