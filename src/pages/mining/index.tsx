import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import React, { ComponentRef, useCallback, useMemo, useRef } from 'react'
import { parseUnits } from 'viem'

import AmmCard from '@/components/amm/AmmCard'
import CountdownTimer from '@/components/amm/CountdownTimer'
import KeyValue from '@/components/common/KeyValue'
import { Card } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { NumberInput } from '@/components/ui/Input'
import { KanitText } from '@/components/ui/Text'
import { useTransferInfo, useTransferUSDT, useUserTotalTransfer } from '@/features/amm/hooks/useTransferUSDT'
import { formatWithCommas } from '@/lib/format'

const Amm: React.FC = () => {
  const { userTotalTransfer, refetch: refetchUserTotalTransfer } = useUserTotalTransfer()
  const {
    endBlock,
    totalTransferredAmount,
    maxDepositAmount,
    percentage,
    refetch: refetchTransferInfo
  } = useTransferInfo()

  const { transferValue, setTransferValue, transferUSDT, loading: transferLoading } = useTransferUSDT()

  const transferDialog = useRef<ComponentRef<typeof Dialog>>(null)

  const limit = useMemo(
    () => ({
      min: '20',
      max: maxDepositAmount
    }),
    [maxDepositAmount]
  )

  const handleTransfer = useCallback(() => {
    const value = parseUnits(transferValue, 18)
    if (!value) return
    console.log('>>>>>> value: ', value)
    transferUSDT(value).then(() => {
      transferDialog.current?.close()
      refetchUserTotalTransfer()
      refetchTransferInfo()
    })
  }, [refetchTransferInfo, refetchUserTotalTransfer, transferUSDT, transferValue])

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
            <span>{percentage || '--'}%</span>
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
              {formatWithCommas(userTotalTransfer ?? '--')}
            </KanitText>
          }
        />

        <Dialog
          ref={transferDialog}
          trigger={{
            asChild: true,
            children: (
              <Button variant={'gradient'} className="mt-6 w-full" size={'lg'}>
                <Trans>共建</Trans>
              </Button>
            )
          }}
          closeable={false}
          content={{ className: 'max-w-[424px] ' }}
        >
          <NumberInput
            size={'lg'}
            max={limit.max}
            min={limit.min}
            placeholder={t`请输入...`}
            value={transferValue}
            onChange={(ev) => setTransferValue(ev.target.value)}
          />
          <Button
            className="mt-6 w-full"
            size={'xl'}
            variant={'gradient'}
            isLoading={transferLoading}
            disabled={transferLoading}
            onClick={handleTransfer}
          >
            <Trans>共建</Trans>
          </Button>
        </Dialog>
      </AmmCard>
    </div>
  )
}

export default Amm
