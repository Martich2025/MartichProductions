export default function Head() {
  const base = 'https://martichproductions.com'
  const url = base + '/engine/plan'
  const title = 'Your 90‑Day Mini Plan | Martich Productions'
  const desc = 'Share, download, or email your AI‑drafted Mini Plan with hooks, titles, captions, and a cadence preview.'
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

