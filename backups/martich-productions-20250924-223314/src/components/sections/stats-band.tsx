import React from 'react'

const StatsBand = () => {
  const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '15+', label: 'Years Experience' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '50M+', label: 'Views Generated' },
  ]

  const bullets = [
    '180–340% lift in qualified leads in 90 days',
    '2–4× content output per shoot',
    '30–60% faster time‑to‑publish',
  ]

  return (
    <section className="py-8 bg-mp-black content-visibility-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-mp-charcoal rounded-xl p-6 border border-mp-gray-800">
              <div className="text-2xl md:text-3xl font-bold text-mp-gold tabular-nums mb-1">{s.value}</div>
              <div className="text-sm text-mp-gray-300">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-mp-gray-300 text-sm md:text-base max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-center md:gap-6 gap-2 text-center md:text-left">
            {bullets.map((b, i) => (
              <span key={i}>• {b}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { StatsBand }


