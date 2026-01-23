import React, { useState } from 'react'
import { Flex, Grid } from '../ui/Box'
import { KanitText } from '../ui/Text'

const unitClassName = 'text-xs font-bold text-text-tertiary'
const colonClassName = 'text-xs font-bold text-text-tertiary mx-[1px]'
const dateClassName = 'w-[0.8em] bg-disabled text-xs font-bold text-text-active'

const CountdownTimer: React.FC = () => {
  const [date] = useState({
    days: '01',
    hours: '23',
    minutes: '59',
    seconds: '59'
  })
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
