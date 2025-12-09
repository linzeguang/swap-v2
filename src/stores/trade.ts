import { Pair } from '@pippyswap/v2-sdk'
import { Token } from '@uniswap/sdk-core'
import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai/vanilla'

import { StorageKey } from '@/constants/storages'

export const tokenImagesAtom = atom<Record<string, string>>({})

export const tokenListAtom = atom<Token[]>([])

export const importTokenListAtom = atomWithStorage<[number, string, number, string | undefined, string | undefined][]>(
  StorageKey.ImportTokens,
  [],
  undefined,
  { getOnInit: true }
)

export const pairListAtom = atom<Pair[]>([])
