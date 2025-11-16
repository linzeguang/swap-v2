import { Currency, NativeCurrency, Token, WETH9 } from '@uniswap/sdk-core'
import { bsc, bscTestnet } from 'viem/chains'

export class Native extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'BNB', 'Binance Chain Native Token')
  }

  public get wrapped(): Token {
    const WBNB = WETH9[bsc.id]
    return new Token(bscTestnet.id, '0x8a9ecefbdaaac3a7c162871cc4252970802acebd', WBNB.decimals, WBNB.symbol, WBNB.name)
  }

  private static _etherCache: { [chainId: number]: Native } = {}

  public static onChain(chainId: number): Native {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Native(chainId))
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

export const BNB = Native.onChain(bscTestnet.id)
export const WBNB = BNB.wrapped
export const USDT = new Token(bscTestnet.id, '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', 6, 'USDT', 'Tether USD')
export const USDC = new Token(bscTestnet.id, '0x64544969ed7EBf5f083679233325356EbE738930', 6, 'USDC', 'USD Coin')
export const ETH = new Token(bscTestnet.id, '0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378', 6, 'ETH', 'Ethereum Token')

export const POPULAR_TOKENS = [BNB, WBNB]

export const TOKEN_LIST = [BNB, WBNB, USDT, USDC, ETH]
