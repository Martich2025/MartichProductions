'use client'

import React from 'react'
import Script from 'next/script'

export function ConsentScripts() {
  const [hasConsent, setHasConsent] = React.useState(false)

  React.useEffect(() => {
    try {
      const accepted = localStorage.getItem('mp_cookie_consent') === 'accepted'
      setHasConsent(!!accepted)
      const onStorage = () => setHasConsent(localStorage.getItem('mp_cookie_consent') === 'accepted')
      window.addEventListener('storage', onStorage)
      return () => window.removeEventListener('storage', onStorage)
    } catch {}
  }, [])

  if (!hasConsent) return null

  return (
    <>
      {process.env.NEXT_PUBLIC_GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {process.env.NEXT_PUBLIC_POSTHOG_KEY && (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[];var c=["capture","identify","alias","people.set","people.set_once","track_pageview","reset","group","set_group","group_identify"];for(o=0;o<c.length;o++)g(u,c[o]);e._i.push([i,s,a])},e.load=function(i,s){e.init(i,s,"posthog")}}(document,window.posthog||[]);
            posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', { api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com'}' });
          `}
        </Script>
      )}
    </>
  )
}
