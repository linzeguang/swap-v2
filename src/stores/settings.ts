import { atomWithStorage } from 'jotai/utils'

import { StorageKey } from '@/constants/storages'
import { Locale } from '@/i18n'

export const localeAtom = atomWithStorage<Locale>(StorageKey.Locale, Locale.ZH, undefined, { getOnInit: true })

export enum Theme {
  Dark = 'dark',
  Light = 'light'
}
export const themeAtom = atomWithStorage<Theme>(StorageKey.Theme, Theme.Light, undefined, {
  getOnInit: true
})

export enum Slippage {
  Auto = 'Auto'
}
export const slippageAtom = atomWithStorage<Slippage | number>(StorageKey.Slippage, Slippage.Auto, undefined, {
  getOnInit: true
})

export const deadlineAtom = atomWithStorage<number>(StorageKey.Deadline, 10, undefined, {
  getOnInit: true
})

export const infiniteApprovalAtom = atomWithStorage<boolean>(StorageKey.InfiniteApproval, false, undefined, {
  getOnInit: true
})
