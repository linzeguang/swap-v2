import { atomWithStorage } from 'jotai/utils'

import { StorageKey } from '@/constants/storages'
import { Locale } from '@/i18n'

export const localeAtom = atomWithStorage<Locale>(StorageKey.Locale, Locale.ZH, undefined, { getOnInit: true })

export enum Theme {
  Dark = 'dark',
  Light = 'light'
}
export const themeAtom = atomWithStorage<Theme>(StorageKey.Theme, Theme.Dark, undefined, {
  getOnInit: true
})

export const slippageAtom = atomWithStorage<number>(StorageKey.Slippage, 0.5, undefined, {
  getOnInit: true
})

export const deadlineAtom = atomWithStorage<number>(StorageKey.Deadline, 10, undefined, {
  getOnInit: true
})

export const infiniteApprovalAtom = atomWithStorage<boolean>(StorageKey.InfiniteApproval, false, undefined, {
  getOnInit: true
})
