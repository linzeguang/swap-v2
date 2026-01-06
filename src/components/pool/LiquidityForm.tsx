import { Trans } from '@lingui/react/macro'
import { Pair } from '@pippyswap/v2-sdk'
import React, { useState } from 'react'

import { LiquidityAmountInputFixed } from '../common/AmountInput'
import TokenBalance from '../common/TokenBalance'
import TokenImage from '../common/TokenImage'
import { Add2 } from '../svgr/pool'
import { Card, Flex, Grid } from '../ui/Box'
import { Button, ButtonRadioGroup } from '../ui/Button'
import { KanitText } from '../ui/Text'

enum LiquidityAction {
  Add,
  Remove
}

const LiquidityForm: React.FC<{ pair: Pair }> = ({ pair }) => {
  const [action, setAction] = useState(LiquidityAction.Add)

  const quickInput = [
    { lable: '25%', value: 0.25 },
    { lable: '50%', value: 0.5 },
    { lable: '75%', value: 0.75 },
    { lable: '100%', value: 1 }
  ]

  return (
    <Card className="space-y-4">
      <ButtonRadioGroup
        className="rounded-full"
        value={action}
        options={[
          {
            label: <Trans>Add</Trans>,
            value: LiquidityAction.Add,
            variant: action === LiquidityAction.Add ? 'gradient' : 'default',
            className: 'rounded-full flex-auto px-8'
          },
          {
            label: <Trans>Remove</Trans>,
            value: LiquidityAction.Remove,
            variant: action === LiquidityAction.Remove ? 'gradient' : 'default',
            className: 'rounded-full flex-auto px-8'
          }
        ]}
        onChangeValue={setAction}
      />
      <div className="space-y-2">
        <LiquidityAmountInputFixed
          token={pair.token0}
          title={
            <Flex className="items-center justify-between">
              <Flex className="space-x-2">
                <TokenImage token={pair.token0} className="size-6 lg:size-7" />
                <KanitText className="font-semibold text-text-primary lg:text-xl">{pair.token0.symbol}</KanitText>
              </Flex>
              <KanitText variant={'tertiary'} className="flex items-center space-x-2 text-xs">
                <span>
                  <Trans>Balance: </Trans>
                </span>
                <TokenBalance token={pair.token0} />
              </KanitText>
            </Flex>
          }
          suffixNode={
            <Grid className="grid-cols-4 gap-2">
              {quickInput.map(({ lable, value }) => (
                <Button
                  key={value}
                  size={'sm'}
                  onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
                  onHoveredOutline={(hovered) => !hovered}
                  className="rounded-full"
                >
                  {lable}
                </Button>
              ))}
            </Grid>
          }
        />
        <Flex className="justify-center">
          <Add2 />
        </Flex>
        <LiquidityAmountInputFixed
          token={pair.token1}
          title={
            <Flex className="items-center justify-between">
              <Flex className="space-x-2">
                <TokenImage token={pair.token1} className="size-6 lg:size-7" />
                <KanitText className="font-semibold text-text-primary lg:text-xl">{pair.token1.symbol}</KanitText>
              </Flex>
              <KanitText variant={'tertiary'} className="flex items-center space-x-2 text-xs">
                <span>
                  <Trans>Balance: </Trans>
                </span>
                <TokenBalance token={pair.token1} />
              </KanitText>
            </Flex>
          }
          suffixNode={
            <Grid className="grid-cols-4 gap-2">
              {quickInput.map(({ lable, value }) => (
                <Button
                  key={value}
                  size={'sm'}
                  onHoveredVariant={(hovered) => (hovered ? 'gradient' : 'tertiary')}
                  onHoveredOutline={(hovered) => !hovered}
                  className="rounded-full"
                >
                  {lable}
                </Button>
              ))}
            </Grid>
          }
        />
      </div>
      <Button className="w-full" size={'xl'} variant={'gradient'}>
        <Trans>Add</Trans>
      </Button>
    </Card>
  )
}

export default LiquidityForm
