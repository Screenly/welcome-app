import './css/style.css'

// Side-effect import: registers <auto-scaler> as a custom element
import '@screenly/edge-apps/components'
import {
  formatLocalizedDate,
  formatTime,
  getLocale,
  getTimeZone,
  isLightColor,
  setupBrandingLogo,
  setupErrorHandling,
  setupTheme,
} from '@screenly/edge-apps'
import init from './app'
import { DAYPARTS, getDaypart, getGreeting } from './daypart'
import { getWelcomeMode } from './mode'

const CLOCK_UPDATE_INTERVAL_MS = 1000
const DAYPART_UPDATE_INTERVAL_MS = 60 * 1000

function getLocalHour(timezone: string): number {
  return Number(formatTime(new Date(), 'en', timezone, { hour12: false }).hour)
}

function applyDaypart(timezone: string) {
  const daypart = getDaypart(getLocalHour(timezone))
  document.body.classList.remove(...DAYPARTS.map((part) => `daypart-${part}`))
  document.body.classList.add(`daypart-${daypart}`)
}

function setupClock(locale: string, timezone: string) {
  const timeEl = document.querySelector('[data-time]')
  if (!timeEl) return

  const updateClock = () => {
    const { hour, minute, dayPeriod } = formatTime(new Date(), locale, timezone)
    timeEl.textContent = dayPeriod
      ? `${hour}:${minute} ${dayPeriod}`
      : `${hour}:${minute}`
  }

  updateClock()
  setInterval(updateClock, CLOCK_UPDATE_INTERVAL_MS)
}

function setupEyebrow(locale: string, timezone: string) {
  const eyebrowEl = document.querySelector('[data-eyebrow]')
  if (!eyebrowEl) return

  const updateEyebrow = () => {
    const now = new Date()
    // No year: a lobby screen only ever shows today
    const date = formatLocalizedDate(now, locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: undefined,
      timeZone: timezone,
    })
    const greeting = getGreeting(locale, getDaypart(getLocalHour(timezone)))
    eyebrowEl.textContent = greeting ? `${greeting} · ${date}` : date
  }

  updateEyebrow()
  setInterval(updateEyebrow, DAYPART_UPDATE_INTERVAL_MS)
}

async function setupLogo() {
  const logoEl = document.querySelector<HTMLImageElement>('[data-logo]')
  if (!logoEl) return

  logoEl.onerror = () => logoEl.classList.add('is-hidden')
  try {
    logoEl.src = await setupBrandingLogo()
    logoEl.classList.remove('is-hidden')
  } catch {
    // Keep the logo hidden; an unattended screen must not show a broken image
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  setupErrorHandling()

  const { primary } = setupTheme()
  document.body.classList.toggle('is-light-brand', isLightColor(primary))

  const mode = getWelcomeMode()
  document.body.classList.add(`mode-${mode}`)

  const locale = await getLocale()
  const timezone = await getTimeZone()

  applyDaypart(timezone)
  setInterval(() => applyDaypart(timezone), DAYPART_UPDATE_INTERVAL_MS)

  // The poster mode never shows the header or eyebrow, so skip wiring them
  if (mode === 'lobby') {
    setupClock(locale, timezone)
    setupEyebrow(locale, timezone)
    await setupLogo()
  }

  init()
})
