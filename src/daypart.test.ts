import { describe, expect, test } from 'bun:test'
import { getDaypart, getGreeting } from './daypart'

describe('getDaypart', () => {
  test('morning runs from 05:00 to 11:59', () => {
    expect(getDaypart(5)).toBe('morning')
    expect(getDaypart(11)).toBe('morning')
  })

  test('afternoon runs from 12:00 to 17:59', () => {
    expect(getDaypart(12)).toBe('afternoon')
    expect(getDaypart(17)).toBe('afternoon')
  })

  test('evening covers the night', () => {
    expect(getDaypart(18)).toBe('evening')
    expect(getDaypart(23)).toBe('evening')
    expect(getDaypart(0)).toBe('evening')
    expect(getDaypart(4)).toBe('evening')
  })
})

describe('getGreeting', () => {
  test('greets in the locale language', () => {
    expect(getGreeting('en', 'morning')).toBe('Good morning')
    expect(getGreeting('fr', 'evening')).toBe('Bonsoir')
    expect(getGreeting('de', 'afternoon')).toBe('Guten Tag')
  })

  test('matches the language regardless of region or casing', () => {
    expect(getGreeting('en_US', 'morning')).toBe('Good morning')
    expect(getGreeting('fr-FR', 'morning')).toBe('Bonjour')
    expect(getGreeting('ES', 'evening')).toBe('Buenas noches')
  })

  test('returns empty for a language it does not know', () => {
    expect(getGreeting('ja', 'morning')).toBe('')
    expect(getGreeting('', 'morning')).toBe('')
  })
})
