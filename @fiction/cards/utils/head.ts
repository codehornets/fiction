import type { Site } from '@fiction/site'
import { getColorScheme } from '@fiction/core'

export function getSiteBrandColors(args: { site?: Site }) {
  const { site } = args

  const clr = site?.fullConfig.value?.site?.primaryColor || 'blue'

  return getColorScheme(clr, { outputFormat: 'hex' })
}

export function getStructuredData(args: { site?: Site }) {
  const { site } = args
  if (!site)
    return '{}'

  const url = site.frame.displayUrl.value
  const org = site.org
  const config = site.fullConfig.value
  const siteConfig = config.site || {}
  const page = site.currentPage.value
  let slug = page?.slug.value || ''

  slug = slug === '_home' ? '' : slug

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      // Primary Person entity
      {
        '@type': 'Person',
        '@id': `${url}/#person`,
        'name': org?.orgName || site.title.value,
        'url': url,
        'image': siteConfig?.shareImage?.url || org?.avatar?.url,
        'description': siteConfig?.description,
      },

      // Current WebPage
      {
        '@type': 'WebPage',
        '@id': `${url}${slug}#webpage`,
        'url': `${url}${slug || ''}`,
        'name': page?.title.value,
        'description': page?.description.value || siteConfig?.description,
        'mainEntity': { '@id': `${url}/#person` },
        'inLanguage': siteConfig?.locale || 'en-US',
      },
    ],
  }

  return JSON.stringify(structuredData)
}

export function getHeadScripts(args: { site?: Site, noscript?: boolean }) {
  const { site, noscript = false } = args

  const gtmContainerId = site?.fullConfig.value?.site?.gtmContainerId

  if (noscript) {
    return gtmContainerId
      ? [
          {
            innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            type: '',
          },
        ]
      : []
  }
  else {
    const script = [
      {
        innerHTML: 'document.addEventListener(\'DOMContentLoaded\', function() { document.documentElement.style.visibility = \'visible\'; });',
        type: 'text/javascript',
      },
      {
        innerHTML: getStructuredData({ site }),
        type: 'application/ld+json',
      },
    ]

    if (gtmContainerId) {
      script.push({
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmContainerId}');`,
        type: 'text/javascript',
      })
    }

    return script
  }
}
