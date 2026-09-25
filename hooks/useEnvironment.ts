'use client'

import * as navigation from 'next/navigation'

export default function useEnvironment() {
  const searchParams = navigation.useSearchParams()
  const devParam = searchParams?.get('dev') || ''
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
  const isLocalDevelopment =
    process.env.NODE_ENV !== 'production' || isLocalHost
  const isOfficialProduction =
    typeof window !== 'undefined' &&
    window.location.hostname === 'savingsatoshi.com'

  return {
    isDevelopment:
      isLocalDevelopment ||
      (isOfficialProduction
        ? devParam === process.env.NEXT_PUBLIC_DEV_MODE_SECRET
        : devParam === 'true'),
  }
}
