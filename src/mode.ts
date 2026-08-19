import { getSettingWithDefault } from '@screenly/edge-apps'

export const MODES = ['lobby', 'poster'] as const

export type WelcomeMode = (typeof MODES)[number]

export const DEFAULT_MODE: WelcomeMode = 'lobby'

// Settings are free text at the API level, so an instance can hold a value
// this build has never heard of
export function resolveMode(value: string | undefined): WelcomeMode {
  const normalized = value?.trim().toLowerCase() as WelcomeMode
  return MODES.includes(normalized) ? normalized : DEFAULT_MODE
}

export function getWelcomeMode(): WelcomeMode {
  return resolveMode(getSettingWithDefault<string>('mode', DEFAULT_MODE))
}
