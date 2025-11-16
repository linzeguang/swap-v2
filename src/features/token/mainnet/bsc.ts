import { Ether } from '@uniswap/sdk-core'
import { bsc } from 'viem/chains'

export const BNB = Ether.onChain(bsc.id)
export const WBNB = BNB.wrapped

export const POPULAR_TOKENS = [BNB, WBNB]
