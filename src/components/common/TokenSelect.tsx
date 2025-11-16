import { Trans } from '@lingui/react/macro'
import React, { ComponentPropsWithRef } from 'react'

import { cn } from '@/lib/utils'

import { ArrowDown } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Input } from '../ui/Input'
import { TokenSkeleton } from '../ui/Skeleton'
import { KanitText } from '../ui/Text'

const TokenSelect: React.FC<{ dialogProps?: ComponentPropsWithRef<typeof Dialog> }> = ({ dialogProps }) => {
  return (
    <Dialog
      title={<Trans>Token Select</Trans>}
      trigger={{
        asChild: true,
        children: (
          <Button className="px-2">
            <TokenSkeleton className="size-8" />
            <Flex className="items-center">
              <KanitText className="text-xl font-semibold">Symbol</KanitText>
              <ArrowDown />
            </Flex>
          </Button>
        )
      }}
      {...dialogProps}
      content={{
        className: cn('max-w-[420px] space-y-3 h-[80vh] max-h-[654px]', dialogProps?.content?.className),
        ...dialogProps?.content
      }}
    >
      <Input border placeholder="Search name /address" />
    </Dialog>
  )
}

export default TokenSelect
