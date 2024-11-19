const THOUSAND = 1000
const HUNDRED_THOUSAND = 100_000
const MILLION = 1_000_000
const HUNDRED_MILLION = 100_000_000
const BILLION = 1_000_000_000
const HUNDRED_BILLION = 100_000_000_000
const TRILLION = 1_000_000_000_000

export function numberFormatter(num: number | string): string | number {
  num = typeof num === 'string' ? Number.parseFloat(num) : num

  if (num >= TRILLION) {
    const trillions = num / TRILLION
    return trillions === Math.floor(trillions) ? `${Math.floor(trillions)}t` : `${Math.floor(trillions * 10) / 10}t`
  }
  else if (num >= BILLION) {
    const billions = num / BILLION
    return billions === Math.floor(billions) || num >= HUNDRED_BILLION ? `${Math.floor(billions)}b` : `${Math.floor(billions * 10) / 10}b`
  }
  else if (num >= MILLION) {
    const millions = num / MILLION
    return millions === Math.floor(millions) || num >= HUNDRED_MILLION ? `${Math.floor(millions)}m` : `${Math.floor(millions * 10) / 10}m`
  }
  else if (num >= THOUSAND) {
    const thousands = num / THOUSAND
    return thousands === Math.floor(thousands) || num >= HUNDRED_THOUSAND ? `${Math.floor(thousands)}k` : `${Math.floor(thousands * 10) / 10}k`
  }
  else {
    return num
  }
}
/**
 * Formats raw number of seconds into a nice duration
 */
export function durationFormatter(duration: number | undefined, unit: 'ms' | 's' = 's'): string {
  if (duration === undefined)
    return ''

  const msDuration = unit === 'ms' ? duration : duration * 1000

  const hours = Math.floor(msDuration / 60 / 60 / 1000)
  const minutes = Math.floor(msDuration / 60 / 1000) % 60

  const msMinutes = minutes * 60 * 1000
  const msHours = hours * 60 * 60 * 1000

  const out = []
  if (hours > 0) {
    const v = `${hours}h`
    out.push(v)
  }
  if (minutes > 0) {
    const v = `${minutes}m`
    out.push(v)
  }
  if (unit === 's') {
    const seconds = Math.floor((msDuration - msMinutes - msHours) / 1000)
    if (seconds >= 0) {
      const v = `${seconds}s`
      out.push(v)
    }
  }
  else {
    const ms = msDuration - msMinutes - msHours
    if (ms >= 0) {
      const v = `${ms.toLocaleString()}ms`
      out.push(v)
    }
  }

  return out.join(' ')
}
/**
 * Is a number numeric or number-like
 */
export function isNumeric(n: number | string | undefined): boolean {
  if (n === undefined || n === null)
    return false
  return !Number.isNaN(Number.parseFloat(n.toString())) && Number.isFinite(+n)
}

export const numberFormats = ['number', 'abbreviated', 'abbreviatedDollar', 'percent', 'dollar', 'duration', 'rawPercent', 'microDuration'] as const

export type NumberFormats = typeof numberFormats[number]
/**
 * Fancy number formatter supporting various formats
 */
export function formatNumber(value: number | string | undefined, format?: NumberFormats, opts: { prefix?: string, suffix?: string } = {}): string | number | undefined {
  const { prefix = '', suffix = '' } = opts
  let out: string | number | undefined = undefined
  if (!isNumeric(value) || value === undefined)
    return value

  value = +value
  if (format === 'percent' || format === 'rawPercent') {
    value = format === 'rawPercent' ? value * 100 : value
    out = `${Math.round(value * 10) / 10}%`
  }
  else if (format === 'dollar') {
    out = value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    })
  }
  else if (format === 'duration' || format === 'microDuration') {
    out = durationFormatter(value, format === 'microDuration' ? 'ms' : 's')
  }
  else if (format === 'abbreviated') {
    out = numberFormatter(value)
  }
  else if (format === 'abbreviatedDollar') {
    out = `$${numberFormatter(value)}`
  }
  else {
    out = value.toLocaleString()
  }

  return prefix || suffix ? `${prefix}${out}${suffix}` : out
}

export function formatBytes(bytes: number, decimals: number = 2) {
  if (bytes === 0)
    return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
