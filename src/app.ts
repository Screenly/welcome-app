import { getSettingWithDefault, signalReady } from '@screenly/edge-apps'

const LONG_HEADING_CHARS = 16
const VERY_LONG_HEADING_CHARS = 34

// The greeting is customer free text; a long one steps down in size instead
// of wrapping off the canvas
export function getHeadingSizeClass(text: string): string {
  if (text.length > VERY_LONG_HEADING_CHARS) return 'is-very-long'
  if (text.length > LONG_HEADING_CHARS) return 'is-long'
  return ''
}

export default function init() {
  const welcomeHeading = getSettingWithDefault<string>(
    'welcome_heading',
    'Welcome',
  )
  const welcomeMessage = getSettingWithDefault<string>(
    'welcome_message',
    'to the team',
  )

  const headingEl =
    document.querySelector<HTMLParagraphElement>('#welcome-heading')!
  headingEl.className = ['welcome-heading', getHeadingSizeClass(welcomeHeading)]
    .filter(Boolean)
    .join(' ')
  headingEl.textContent = welcomeHeading

  const messageEl =
    document.querySelector<HTMLParagraphElement>('#welcome-message')!
  messageEl.textContent = welcomeMessage

  signalReady()
}
