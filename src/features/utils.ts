import { Currency } from '@uniswap/sdk-core'
import JSBI from 'jsbi'
import { zeroAddress } from 'viem'

export const isZeroAddress = (address: string) => address === zeroAddress

export const jsbiToBigInt = (value?: JSBI) => BigInt(value?.toString() || 0)

export const areTokensIdentical = (currencyA: Currency | undefined, currencyB: Currency | undefined) => {
  if (!currencyA || !currencyB) return false

  // 情況 1: 兩個都是原生幣 (Native)
  if (currencyA.isNative && currencyB.isNative) return true

  // 情況 2: 兩個都是 ERC-20 且地址相同
  if (!currencyA.isNative && !currencyB.isNative && currencyA.address === currencyB.address) return true

  return false
}
