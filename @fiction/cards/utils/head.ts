import type { Site } from '@fiction/site'
import { getColorScheme } from '@fiction/core'

export function getSiteBrandColors(args: { site?: Site }) {
  const { site } = args

  const clr = site?.fullConfig.value.branding?.primaryColor || 'blue'

  return getColorScheme(clr, { outputFormat: 'hex' })
}

export function getHeadScripts(args: { site?: Site, noscript?: boolean }) {
  const { site, noscript = false } = args

  const gtmContainerId = site?.fullConfig.value.customCode?.gtmContainerId

  if (noscript) {
    return gtmContainerId
      ? [{ innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>` }]
      : []
  }
  else {
    const script = [{
      innerHTML: 'document.addEventListener(\'DOMContentLoaded\', function() { document.documentElement.style.visibility = \'visible\'; });',
      type: 'text/javascript',
    }]

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
