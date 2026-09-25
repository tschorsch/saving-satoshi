'use client'

import * as navigation from 'next/navigation'

export const isDevelopmentEnvironment = (
  nodeEnv: string | undefined,
  devParam: string
) => (nodeEnv === 'development' || nodeEnv === 'test') && devParam === 'true'

export default function useEnvironment() {
  const searchParams = navigation.useSearchParams()
  const devParam = searchParams?.get('dev') || ''

  return {
    isDevelopment: isDevelopmentEnvironment(process.env.NODE_ENV, devParam),
  }
}
