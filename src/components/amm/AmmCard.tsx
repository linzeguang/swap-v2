import React, { PropsWithChildren } from 'react'

import { Card, Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

const AmmCard: React.FC<PropsWithChildren<{ title: React.ReactNode; subTitle?: React.ReactNode }>> = ({
  title,
  subTitle,
  children
}) => {
  return (
    <Card>
      <Flex className="justify-between border-b border-border pb-4">
        <KanitText variant={'tertiary'} className="text-xs font-bold">
          {title}
        </KanitText>
        {subTitle}
      </Flex>
      {children}
    </Card>
  )
}

export default AmmCard
