import JSBI from 'jsbi'

export const jsbiToBigInt = (value: JSBI) => BigInt(value.toString())
