import { describe, test, expect, beforeEach, afterEach } from 'bun:test'
import { setupScreenlyMock, resetScreenlyMock } from '@screenly/edge-apps/test'

import init, { getHeadingSizeClass } from './app'

describe('Welcome App', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <p id="welcome-heading"></p>
      <p id="welcome-message"></p>
    `

    setupScreenlyMock(
      {},
      {
        welcome_heading: 'Welcome',
        welcome_message: 'to the team',
      },
    )
  })

  afterEach(() => {
    resetScreenlyMock()
    document.body.innerHTML = ''
  })

  test('renders welcome heading from settings', () => {
    init()

    expect(document.querySelector('#welcome-heading')?.textContent).toBe(
      'Welcome',
    )
  })

  test('renders welcome message from settings', () => {
    init()

    expect(document.querySelector('#welcome-message')?.textContent).toBe(
      'to the team',
    )
  })

  test('falls back to default heading when setting is missing', () => {
    setupScreenlyMock({}, {})
    init()

    expect(document.querySelector('#welcome-heading')?.textContent).toBe(
      'Welcome',
    )
  })

  test('falls back to default message when setting is missing', () => {
    setupScreenlyMock({}, {})
    init()

    expect(document.querySelector('#welcome-message')?.textContent).toBe(
      'to the team',
    )
  })

  test('steps a long heading down in size', () => {
    setupScreenlyMock({}, { welcome_heading: 'Welcome to our headquarters' })
    init()

    const headingEl = document.querySelector('#welcome-heading')
    expect(headingEl?.classList.contains('is-long')).toBe(true)
  })
})

describe('getHeadingSizeClass', () => {
  test('returns no class for a short heading', () => {
    expect(getHeadingSizeClass('Welcome')).toBe('')
  })

  test('returns is-long past 16 characters', () => {
    expect(getHeadingSizeClass('a'.repeat(17))).toBe('is-long')
  })

  test('returns is-very-long past 34 characters', () => {
    expect(getHeadingSizeClass('a'.repeat(35))).toBe('is-very-long')
  })

  test('treats the thresholds as exclusive', () => {
    expect(getHeadingSizeClass('a'.repeat(16))).toBe('')
    expect(getHeadingSizeClass('a'.repeat(34))).toBe('is-long')
  })
})
