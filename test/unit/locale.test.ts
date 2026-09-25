import { describe, expect, it } from 'vitest'
import { getLocaleFromHeaders } from 'middleware'

describe('locale detection', () => {
  it('matches a regional browser locale to a supported route locale', () => {
    const headers = new Headers({
      'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
    })

    expect(getLocaleFromHeaders(headers)).toBe('de')
  })

  it('maps the valid Intl locale for Chinese to the existing route locale', () => {
    const headers = new Headers({ 'accept-language': 'zh-CN,zh;q=0.9' })

    expect(getLocaleFromHeaders(headers)).toBe('zh_cn')
  })

  it('falls back safely for an unsupported locale', () => {
    const headers = new Headers({ 'accept-language': 'xx-INVALID' })

    expect(getLocaleFromHeaders(headers)).toBe('en')
  })
})
