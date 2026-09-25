// import acceptLanguage from 'accept-language'
// acceptLanguage.languages(locales)

import { NextRequest, NextResponse } from 'next/server'

import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { i18n } from 'i18n/config'

export function getLocaleFromHeaders(headers: Headers): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const localeMappings = i18n.locales.map(({ locale }) => ({
    routeLocale: locale,
    intlLocale: locale.replace('_', '-'),
  }))
  const intlLocales = localeMappings.map(({ intlLocale }) => intlLocale)

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders })
    .languages()
    .filter((language) => language !== '*')

  try {
    const intlLocale = matchLocale(languages, intlLocales, i18n.defaultLocale)
    return (
      localeMappings.find((locale) => locale.intlLocale === intlLocale)
        ?.routeLocale ?? i18n.defaultLocale
    )
  } catch {
    return i18n.defaultLocale
  }
}

function getLocale(request: NextRequest): string {
  return getLocaleFromHeaders(request.headers)
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  if (!pathname) {
    return NextResponse.next()
  }

  // Redirect to '/' for homepage
  if (
    (pathname !== '/' && !pathname.startsWith('/.well-known/')) ||
    getLocale(request) !== 'en'
  ) {
    const pathnameIsMissingLocale = i18n.locales.every(
      (language) =>
        !pathname.startsWith(`/${language.locale}/`) &&
        pathname !== `/${language.locale}`
    )
    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request)

      // e.g. incoming request is /products
      // The new URL is now /en-US/products
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url)
      )
    }
  }
}

export const config = {
  // TODO: Find a way to handle these dynamically
  matcher: [
    '/((?!_next/static|_next/image|assets|favicon|favicon.ico|android-icon|robots.txt|sitemap.xml|manifest.json|.well-known/nostr.json).*)',
  ],
}
