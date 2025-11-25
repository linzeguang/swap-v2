import { Trans } from '@lingui/react/macro'
import React from 'react'

import KeyValue from '../common/KeyValue'
import { Copy, Tip } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { KanitText } from '../ui/Text'

const Preview: React.FC = () => {
  return (
    <div className="border-border-thin space-y-2.5 rounded-2xl border p-4">
      <KeyValue keyNode={`1 POL = 0.164 USDT`} ValueNode={`1 USDT = 6.08 POL`} />
      <KeyValue
        keyNode={
          <Flex className="items-center space-x-1">
            <Tip className="text-icon" />
            {/* <Tooltip trigger={{ children: <Tip className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
            <KanitText variant={'tertiary'} className="text-xs">
              <Trans>Your Pool Share</Trans>
            </KanitText>
          </Flex>
        }
        ValueNode={`0.0000224635%`}
      />
      <KeyValue
        keyNode={
          <Flex className="items-center space-x-1">
            <Tip className="text-icon" />
            {/* <Tooltip trigger={{ children: <Tip className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
            <KanitText variant={'tertiary'} className="text-xs">
              <Trans>LP Tokens Received</Trans>
            </KanitText>
          </Flex>
        }
        ValueNode={`0 LP`}
      />
      <KeyValue
        keyNode={
          <Flex className="items-center space-x-1">
            <Tip className="text-icon" />
            {/* <Tooltip trigger={{ children: <Tip className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
            <KanitText variant={'tertiary'} className="text-xs">
              <Trans>LP address</Trans>
            </KanitText>
          </Flex>
        }
        ValueNode={
          <KanitText className="flex items-center space-x-1 text-xs text-secondary">
            <span>0x11****9999</span>
            <Copy />
          </KanitText>
        }
      />
    </div>
  )
}

export default Preview
