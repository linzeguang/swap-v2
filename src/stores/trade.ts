import { Pair } from '@pippyswap/v2-sdk'
import { Token } from '@uniswap/sdk-core'
import { atom } from 'jotai/vanilla'

export const tokenImagesAtom = atom<Record<string, string>>({})
export const tokenListAtom = atom<Token[]>([])
export const pairListAtom = atom<Pair[]>([])
