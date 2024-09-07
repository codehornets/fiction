import { getCookie, setCookieNakedDomain } from '../utils/cookie'
import { objectId } from '../utils/id'

export const ANON_ID_KEY = 'FictionAnonId'
export const FIRST_SESSION_KEY = 'FictionFirstSession'

export function getAnonymousId(): {
  anonymousId: string
  isNew: boolean
} {
  if (typeof window === 'undefined')
    return { anonymousId: 'no_window', isNew: false }

  // Retrieve the anonymous ID from cookie or local storage
  const savedCookie = getCookie(ANON_ID_KEY)
  const savedLocal = localStorage.getItem(ANON_ID_KEY)
  const anonymousId = savedCookie || savedLocal || objectId({ prefix: 'ano' })

  const isNew = !savedCookie && !savedLocal

  if (isNew) {
    // Save the new anonymous ID in cookie and local storage
    setCookieNakedDomain({ name: ANON_ID_KEY, value: anonymousId, attributes: { expires: 365 } })
    localStorage.setItem(ANON_ID_KEY, anonymousId)
    sessionStorage.setItem(FIRST_SESSION_KEY, 'yes')
  }

  return { anonymousId, isNew }
}
