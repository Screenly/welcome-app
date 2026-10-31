export const DAYPARTS = ['morning', 'afternoon', 'evening'] as const

export type Daypart = (typeof DAYPARTS)[number]

const GREETINGS: Record<string, Record<Daypart, string>> = {
  en: {
    morning: 'Good morning',
    afternoon: 'Good afternoon',
    evening: 'Good evening',
  },
  fr: {
    morning: 'Bonjour',
    afternoon: 'Bon après-midi',
    evening: 'Bonsoir',
  },
  de: {
    morning: 'Guten Morgen',
    afternoon: 'Guten Tag',
    evening: 'Guten Abend',
  },
  es: {
    morning: 'Buenos días',
    afternoon: 'Buenas tardes',
    evening: 'Buenas noches',
  },
}

export function getDaypart(hour: number): Daypart {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}

// The dictionary is deliberately small; an unknown locale drops the greeting
// rather than showing the wrong language
export function getGreeting(locale: string, daypart: Daypart): string {
  const language = locale.toLowerCase().split(/[-_]/)[0]
  return GREETINGS[language]?.[daypart] ?? ''
}
