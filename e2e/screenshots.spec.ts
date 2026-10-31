import { test } from '@playwright/test'
import {
  createMockScreenlyForScreenshots,
  getScreenshotsDir,
  RESOLUTIONS,
  setupClockMock,
  setupScreenlyJsMock,
} from '@screenly/edge-apps/test/screenshots'
import path from 'path'

const VARIANTS = [
  { prefix: '', mode: 'lobby' },
  { prefix: 'poster-', mode: 'poster' },
]

for (const { prefix, mode } of VARIANTS) {
  const { screenlyJsContent } = createMockScreenlyForScreenshots(
    { coordinates: [40.7128, -74.006], location: 'New York, NY' },
    {
      enable_analytics: 'false',
      mode,
      override_locale: 'en',
      override_timezone: 'America/New_York',
      welcome_heading: 'Welcome',
      welcome_message: 'to the team, Sam!',
    },
  )

  for (const { width, height } of RESOLUTIONS) {
    test(`screenshot ${prefix}${width}x${height}`, async ({ browser }) => {
      const screenshotsDir = getScreenshotsDir()

      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: 'reduce',
      })
      const page = await context.newPage()

      await setupClockMock(page)
      await setupScreenlyJsMock(page, screenlyJsContent)

      await page.goto('/')
      await page.waitForLoadState('networkidle')

      await page.screenshot({
        path: path.join(screenshotsDir, `${prefix}${width}x${height}.png`),
        fullPage: false,
      })

      await context.close()
    })
  }
}
