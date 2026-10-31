import '@screenly/edge-apps/test'
import { describe, expect, test } from 'bun:test'
import { DEFAULT_MODE, resolveMode } from './mode'

describe('resolveMode', () => {
  test('returns known modes exactly', () => {
    expect(resolveMode('lobby')).toBe('lobby')
    expect(resolveMode('poster')).toBe('poster')
  })

  test('normalises casing and whitespace', () => {
    expect(resolveMode('  Poster ')).toBe('poster')
    expect(resolveMode('LOBBY')).toBe('lobby')
  })

  test('falls back to the default for unknown values', () => {
    expect(resolveMode('banner')).toBe(DEFAULT_MODE)
    expect(resolveMode('')).toBe(DEFAULT_MODE)
    expect(resolveMode(undefined)).toBe(DEFAULT_MODE)
  })
})
