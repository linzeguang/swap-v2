import { atomWithStorage } from 'jotai/utils'

import { STORAGE_KEY } from '@/constants/storages'
import { LOCALE } from '@/i18n'

export const localeAtom = atomWithStorage<LOCALE>(STORAGE_KEY.LOCALE, LOCALE.ZH, undefined, { getOnInit: true })

export enum Theme {
  Dark = 'dark',
  Light = 'light'
}
export const themeAtom = atomWithStorage<Theme>(STORAGE_KEY.THEME, Theme.Light, undefined, {
  getOnInit: true
})
