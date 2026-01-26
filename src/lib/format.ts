import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function formatAddress(
  address: string = '',
  startChars: number = 6,
  endChars: number = -4,
  separator: string = '...'
) {
  return `${address.slice(0, startChars)}${separator}${endChars ? address.slice(endChars) : ''}`
}

export function formatNumber(
  value: BigNumber.Value,
  decimalPlaces: number = 2,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
) {
  return new BigNumber(value).toFixed(decimalPlaces, roundingMode)
}

// 数字转换为带单位的字符串 取绝对值
/**
 * 格式化大数字，使其更易于阅读。
 *
 * 此函数将大数字格式化为带有单位的字符串，适用于千（k）、百万（M）、十亿（B）级别。
 * 它可以根据数字的大小自动选择合适的单位，并对小数部分进行截断或格式化。
 *
 * @param num 要格式化的数字。
 * @param nums 小数点前导零的最小数量，默认为4。
 * @param i18nUnits 自定义单位，用于替换默认的"k"、"M"、"B"单位。
 * @returns 格式化后的数字字符串。
 */
export const formatLargeNumber = (
  num: BigNumber.Value,
  nums: number = 4,
  precision: number = 4,
  i18nUnits?: Record<'k' | 'M' | 'B', string>
) => {
  if (!num) return '0'

  const absNum = new BigNumber(num).abs()
  const defaultUnits: Record<'k' | 'M' | 'B', string> = {
    k: 'k',
    M: 'M',
    B: 'B'
  }
  const units = { ...defaultUnits, ...i18nUnits }

  // **小于 1000，保留 4 位小数，处理 0.0000x 格式**
  if (absNum.lt(1000)) {
    const str = absNum.toFixed(10).replace(/0+$/, '') // 去掉末尾 0
    const match = str.match(/^0\.(0*)(\d+)/)

    if (match) {
      const [, leadingZeros, significantPart] = match
      const zeroCount = leadingZeros.length

      if (zeroCount >= nums) {
        // 生成下标 0
        const subscriptZeros = Array.from(zeroCount.toString())
          .map((digit) => String.fromCharCode(0x2080 + parseInt(digit)))
          .join('')

        return `0.0${subscriptZeros}${significantPart.slice(0, precision).replace(/0+$/, '')}`
      }
    }

    // **普通情况，保留 4 位小数**
    const [integerPart, fractionalPart = ''] = absNum.toFixed(10).split('.')
    const truncatedFraction = fractionalPart.slice(0, precision).replace(/0+$/, '')

    return truncatedFraction.length > 0 ? `${integerPart}.${truncatedFraction}` : integerPart
  }

  // **大于等于 1000，保留 1 位小数，带单位**
  let unitIndex = -1
  let scaledNum = absNum
  const unitKeys: ('k' | 'M' | 'B')[] = ['k', 'M', 'B']

  while (scaledNum.gte(1000) && unitIndex < unitKeys.length - 1) {
    scaledNum = scaledNum.div(1000)
    unitIndex++
  }

  // **四舍五入改为直接截断**
  const [integerPart, fractionalPart = ''] = scaledNum.toFixed(10).split('.')
  const truncatedFraction = fractionalPart.slice(0, 1) // **保留 1 位小数**

  const formattedScaledNum = `${integerPart}.${truncatedFraction}`.replace(/\.?0+$/, '') // 去掉末尾 0

  const unit = unitKeys[unitIndex] ? units[unitKeys[unitIndex]] : ''
  return `${formattedScaledNum}${unit}`
}

export function formatWithCommas(value: BigNumber.Value | '--') {
  return value === '--' ? value : new BigNumber(value).toFormat() // 默认每三位加一个逗号
}

export function formatCountdown(targetTimestamp: number) {
  const now = dayjs()
  const target = dayjs(targetTimestamp)
  const diff = target.diff(now)

  if (diff <= 0)
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    }

  const dur = dayjs.duration(diff)

  // 格式化输出
  return {
    days: Math.floor(dur.asDays()) < 10 ? `0${Math.floor(dur.asDays())}` : `${Math.floor(dur.asDays())}`,
    hours: dur.hours() < 10 ? `0${dur.hours()}` : `${dur.hours()}`,
    minutes: dur.minutes() < 10 ? `0${dur.minutes()}` : `${dur.minutes()}`,
    seconds: dur.seconds() < 10 ? `0${dur.seconds()}` : `${dur.seconds()}`
  }
}
