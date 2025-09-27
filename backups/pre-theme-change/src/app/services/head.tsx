export default function Head() {
  const base = 'https://martichproductions.com'
  const url = base + '/services'
  const title = 'Services | Martich Productions'
  const desc = 'Social + web as one engine: cinematic film, conversion‑first pages, and best‑time publishing for luxury brands.'
  const og = '/og-image.svg'
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={og} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={og} />
    </>
  )
}

