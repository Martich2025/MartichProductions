export default function Head() {
  const base = 'https://martichproductions.com'
  const url = base + '/work'
  const title = 'Client Outcomes | Martich Productions'
  const desc = 'Integrated films, pages, and publishing that compound into booked business. Explore outcomes across resorts, realtors, hospitality, and events.'
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

