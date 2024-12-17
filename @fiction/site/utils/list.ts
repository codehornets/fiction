import type { NavListItem } from '@fiction/core'
import type { Card, Site } from '..'
import { siteLink } from './manage.js'

export function getSiteIndexItemList(sites: Site[], parentCard: Card): NavListItem[] {
  if (!sites || !sites.length)
    return []

  const fictionAppSites = parentCard.site?.fictionSites.settings.fictionAppSites

  if (!fictionAppSites) {
    throw new Error('parentCard missing site')
  }

  const rows = sites.map((site) => {
    const domain = site.primaryCustomDomain.value || fictionAppSites.liveUrl.value.replace('*', site.settings.subDomain || '')
    const displayDomain = domain.replace('https://', '').replace('http://', '').replace('www.', '')
    const editLink = siteLink({ site: parentCard.site, location: { path: '/edit-site', query: { siteId: site.settings.siteId } } })
    const out: NavListItem = {
      label: site.settings.title || 'Untitled',
      description: `${displayDomain}`,
      key: site.settings.siteId,
      href: editLink,
      // figure: { el: vue.defineAsyncComponent(() => import('./fig/FigSite.vue')), props: { site } },
      dateAt: site.settings.updatedAt,
      icon: { class: 'i-tabler-browser' },
    }

    return out
  })

  return rows
}
