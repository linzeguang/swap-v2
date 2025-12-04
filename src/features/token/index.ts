import { Currency, Token } from '@uniswap/sdk-core'
import { bsc, bscTestnet } from 'viem/chains'

import { BSC } from './mainnet'
import { BSC_TESTNET } from './testnet'

export default {
  [bscTestnet.id]: {
    ETH: BSC_TESTNET.BNB,
    WETH: BSC_TESTNET.WBNB,
    USDT: BSC_TESTNET.USDT,
    TOKEN_LIST: BSC_TESTNET.TOKEN_LIST,
    POPULAR_TOKENS: BSC_TESTNET.POPULAR_TOKENS
  },
  [bsc.id]: {
    ETH: BSC.BNB,
    WETH: BSC.WBNB,
    USDT: BSC.USDT,
    TOKEN_LIST: BSC.TOKEN_LIST,
    POPULAR_TOKENS: BSC.POPULAR_TOKENS
  }
} as Record<number, { ETH: Currency; WETH: Token; USDT: Token; TOKEN_LIST: Currency[]; POPULAR_TOKENS: Currency[] }>
