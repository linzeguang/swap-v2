import { Ether, Token } from '@uniswap/sdk-core'
import { bsc } from 'viem/chains'

export const BNB = Ether.onChain(bsc.id)
export const WBNB = BNB.wrapped
export const UCO = new Token(bsc.id, '0x4C02687e17bFD508820D96dfF3BBBe2D2B74A88d', 18, 'UCO', 'UCO Coin')
export const USDT = new Token(bsc.id, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')

export const POPULAR_TOKENS = [BNB, WBNB]

export const TOKEN_LIST = [BNB, WBNB]
