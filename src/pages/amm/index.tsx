import { Trans } from '@lingui/react/macro'
import React from 'react'

import AmmCard from '@/components/amm/AmmCard'
import CountdownTimer from '@/components/amm/CountdownTimer'
import KeyValue from '@/components/common/KeyValue'
import { Card } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { KanitText } from '@/components/ui/Text'
import { useTransferInfo, useUserTotalTransfer } from '@/features/amm/hooks/useTransferUSDT'
import { formatWithCommas } from '@/lib/format'

const Amm: React.FC = () => {
  const userTotalTransfer = useUserTotalTransfer()
  const { endBlock, totalTransferredAmount } = useTransferInfo()

  return (
    <div className="mx-auto mt-[42px] w-full max-w-[424px] space-y-6">
      <Card className="space-y-2.5 text-center">
        <KanitText className="text-xl font-semibold text-text-primary">
          <Trans>截止区块高度</Trans> {formatWithCommas(endBlock ?? '--')}
        </KanitText>
        <CountdownTimer />
      </Card>
      <AmmCard
        title={
          <KanitText variant={'tertiary'} className="text-xs font-bold">
            <Trans>全网累计共建USDT</Trans>
          </KanitText>
        }
        subTitle={
          <KanitText className="flex items-center space-x-1 text-xs font-bold" variant={'active'}>
            <span className="size-1.5 rounded-full bg-text-active"></span>
            <span>100%</span>
          </KanitText>
        }
      >
        <KeyValue
          classname="mt-6"
          keyNode={
            <KanitText className="text-2xl font-bold" variant={'tertiary'}>
              USDT
            </KanitText>
          }
          valueNode={
            <KanitText className="text-4xl font-bold" variant={'primary'}>
              {formatWithCommas(totalTransferredAmount ?? '--')}
            </KanitText>
          }
        />
      </AmmCard>
      <AmmCard
        title={
          <KanitText variant={'tertiary'} className="text-xs font-bold">
            <Trans>个人已共建USDT</Trans>
          </KanitText>
        }
      >
        <KeyValue
          classname="mt-6"
          keyNode={
            <KanitText className="text-2xl font-bold" variant={'tertiary'}>
              USDT
            </KanitText>
          }
          valueNode={
            <KanitText className="text-4xl font-bold" variant={'primary'}>
              {userTotalTransfer}
              {formatWithCommas(userTotalTransfer ?? '--')}
            </KanitText>
          }
        />
        <Button variant={'gradient'} className="mt-6 w-full" size={'lg'}>
          <Trans>共建</Trans>
        </Button>
      </AmmCard>
    </div>
  )
}

export default Amm
