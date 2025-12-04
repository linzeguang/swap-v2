import { Currency, NativeCurrency, Token, WETH9 } from '@uniswap/sdk-core'
import { bsc, bscTestnet } from 'viem/chains'

export class Native extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'BNB', 'Binance Chain Native Token')
  }

  public get wrapped(): Token {
    const WBNB = WETH9[bsc.id]
    return new Token(bscTestnet.id, '0x61A43B024AfAF9CC646570710e5acb7805342d03', WBNB.decimals, WBNB.symbol, WBNB.name)
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
// export const USDT = new Token(bscTestnet.id, '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', 18, 'USDT', 'Tether USD')
export const USDT = BNB.wrapped
export const USDC = new Token(bscTestnet.id, '0x64544969ed7EBf5f083679233325356EbE738930', 18, 'USDC', 'USD Coin')
export const ETH = new Token(bscTestnet.id, '0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378', 18, 'ETH', 'Ethereum Token')
export const TOKENA = new Token(bscTestnet.id, '0xE6071242710831F27dD4926B22C752574626832d', 18, 'TOKENA', 'TOKEN A')
export const TOKENB = new Token(bscTestnet.id, '0x96187da9e0E057CbC3fCb5c2220eF7A2ec685b21', 18, 'TOKENB', 'TOKEN B')
export const TOKENC = new Token(bscTestnet.id, '0xa2051560C4a76CA63645F9089934a6D444aFce47', 18, 'TOKENC', 'TOKEN C')
export const TOKEND = new Token(bscTestnet.id, '0xD4D681BFEBf563F080A6cA6e40D98B3Bcdf57824', 18, 'TOKEND', 'TOKEN D')

export const POPULAR_TOKENS = [BNB, WBNB]

export const TOKEN_LIST = [BNB, WBNB, TOKENA, TOKENB, TOKENC, TOKEND, USDT, USDC, ETH]

export const CUSTOM_TOKEN_LIST = [TOKENA, TOKENB, TOKENC, TOKEND]
