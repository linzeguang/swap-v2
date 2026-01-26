import React, { useEffect, useState } from 'react'

import { formatCountdown } from '@/lib/format'

import { Grid } from '../ui/Box'
import { KanitText } from '../ui/Text'

const unitClassName = 'text-xs font-bold text-text-tertiary'
const colonClassName = 'text-xs font-bold text-text-tertiary mx-[1px]'
const dateClassName = 'w-[0.8em] bg-disabled text-xs font-bold text-text-active'

const endTime = 1772294400 * 1000 // 2026-03-01 00:00:00

const CountdownTimer: React.FC = () => {
  const [date, setDate] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(formatCountdown(endTime))
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Grid className="grid-cols-[repeat(15,auto)] items-center justify-center gap-0.5">
      {/* days */}
      {date.days.split('').map((str, index) => (
        <KanitText key={index} className={dateClassName}>
          {str}
        </KanitText>
      ))}
      <KanitText className={unitClassName}>D</KanitText>
      <KanitText className={colonClassName}>:</KanitText>
      {/* hours */}
      {date.hours.split('').map((str, index) => (
        <KanitText key={index} className={dateClassName}>
          {str}
        </KanitText>
      ))}
      <KanitText className={unitClassName}>H</KanitText>
      <KanitText className={colonClassName}>:</KanitText>
      {/* minutes */}
      {date.minutes.split('').map((str, index) => (
        <KanitText key={index} className={dateClassName}>
          {str}
        </KanitText>
      ))}
      <KanitText className={unitClassName}>m</KanitText>
      <KanitText className={colonClassName}>:</KanitText>
      {/* seconds */}
      {date.seconds.split('').map((str, index) => (
        <KanitText key={index} className={dateClassName}>
          {str}
        </KanitText>
      ))}
      <KanitText className={unitClassName}>s</KanitText>
    </Grid>
  )
}

export default CountdownTimer
