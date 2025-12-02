import React from 'react'

import { Direction } from '@/constants/enum'
import { cn } from '@/lib/utils'

import { Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

const KeyValue: React.FC<{
  direction?: Direction
  keyNode?: React.ReactNode
  valueNode?: React.ReactNode
  keyClassname?: string
  valueClassname?: string
}> = ({ direction = Direction.Horizontal, keyNode, valueNode, keyClassname, valueClassname }) => {
  return (
    <Flex
      className={cn(
        direction === Direction.Horizontal ? 'items-center justify-between space-x-4' : 'flex-col space-y-4'
      )}
    >
      {React.isValidElement(keyNode) ? (
        keyNode
      ) : (
        <KanitText variant={'tertiary'} className={cn('text-xs', keyClassname)}>
          {keyNode}
        </KanitText>
      )}
      {React.isValidElement(valueNode) ? (
        valueNode
      ) : (
        <KanitText variant={'tertiary'} className={cn('text-xs', valueClassname)}>
          {valueNode}
        </KanitText>
      )}
    </Flex>
  )
}

export default KeyValue
