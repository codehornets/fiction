import type { FictionRouter, FictionUser, NavItem } from '@fiction/core'
import { shortId } from '@fiction/core'

export function processNavItems<T extends NavItem = NavItem>(args: {
  fictionUser: FictionUser
  fictionRouter?: FictionRouter
  items: T[]
  basePathPrefix: string
}): T[] {
  const { items, basePathPrefix, fictionUser, fictionRouter } = args
  const loggedIn = fictionUser.activeUser.value !== undefined
  const current = fictionRouter?.current.value

  const currentPath = current?.fullPath
  return items.map((item, index) => {
    const isHidden = !!((item.authState === 'loggedIn' && !loggedIn) || (item.authState === 'loggedOut' && loggedIn))
    return {
      ...item,
      isActive: item.href === currentPath,
      isHidden,
      basePath: `${basePathPrefix}.${index}`,
      id: shortId(),
      desc: currentPath,
      items: item.items
        ? processNavItems({
          fictionUser,
          fictionRouter,
          items: item.items,
          basePathPrefix: `${basePathPrefix}.${index}.items`,
        })
        : undefined,
    }
  })
}
