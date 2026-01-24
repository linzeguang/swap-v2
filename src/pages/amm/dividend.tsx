import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import React, { ComponentRef, useCallback, useRef } from 'react'
import { parseUnits } from 'viem'

import AmmCard from '@/components/amm/AmmCard'
import KeyValue from '@/components/common/KeyValue'
import { Grid } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { NumberInput } from '@/components/ui/Input'
import { KanitText } from '@/components/ui/Text'
import {
  useClaimDividends,
  useDepositLPTokens,
  useStakingUserInfo,
  useWithdrawInitLPTokens,
  useWithdrawLPTokens
} from '@/features/amm/hooks/useStaking'
import { formatWithCommas } from '@/lib/format'

const Dividend: React.FC = () => {
  const userInfo = useStakingUserInfo()
  const { claimDividends, loading: claimDividendsLoading } = useClaimDividends()
  const { withdrawInitLPTokens, loading: withdrawInitLPTokensLoading } = useWithdrawInitLPTokens()
  const { withdrawValue, setWithdrawValue, withdrawLPTokens, loading: withdrawLPTokensLoading } = useWithdrawLPTokens()
  const { depositValue, setDepositValue, depositLPTokens, loading: depositLPTokensLoading } = useDepositLPTokens()

  const withdrawDialog = useRef<ComponentRef<typeof Dialog>>(null)
  const depositDialog = useRef<ComponentRef<typeof Dialog>>(null)

  const handleWithdraw = useCallback(async () => {
    const value = parseUnits(withdrawValue, 18)
    if (!value) return
    withdrawLPTokens(value).then(() => {
      withdrawDialog.current?.close()
    })
  }, [withdrawLPTokens, withdrawValue])

  const handleDeposit = useCallback(async () => {
    const value = parseUnits(depositValue, 18)
    if (!value) return
    depositLPTokens(value).then(() => {
      depositDialog.current?.close()
    })
  }, [depositValue, depositLPTokens])

  return (
    <>
      <div className="mx-auto mt-[42px] w-full max-w-[508px] space-y-6">
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
              <KanitText className="text-2xl font-semibold" variant={'tertiary'}>
                USDT
              </KanitText>
            }
            valueNode={
              <KanitText className="text-4xl font-bold" variant={'primary'}>
                {formatWithCommas(userInfo?.usdtInvested ?? '--')}
              </KanitText>
            }
          />
        </AmmCard>
        <AmmCard
          title={
            <KanitText variant={'tertiary'} className="text-xs font-bold">
              <Trans>全网质押 LP</Trans>
            </KanitText>
          }
        >
          <KeyValue
            classname="mt-6"
            keyNode={
              <KanitText className="text-2xl font-semibold" variant={'tertiary'}>
                LP
              </KanitText>
            }
            valueNode={
              <KanitText className="text-4xl font-bold" variant={'primary'}>
                {formatWithCommas(userInfo?.totalLpTokensTracked ?? '--')}
              </KanitText>
            }
          />
        </AmmCard>
        <Grid className="grid-cols-2 gap-6">
          <AmmCard
            title={
              <KanitText variant={'tertiary'} className="text-xs font-bold">
                <Trans>LP 质押</Trans>
              </KanitText>
            }
          >
            <KeyValue
              classname="mt-6"
              keyNode={
                <KanitText className="font-semibold" variant={'tertiary'}>
                  LP
                </KanitText>
              }
              valueNode={
                <KanitText className="text-2xl font-bold" variant={'primary'}>
                  {formatWithCommas(userInfo?.lpTokens ?? '--')}
                </KanitText>
              }
            />
            <Grid className="mt-6 grid-cols-2 gap-2">
              <Dialog
                ref={withdrawDialog}
                trigger={{
                  asChild: true,
                  children: (
                    <Button className="w-full rounded-2xl text-sm" variant="gradient">
                      <Trans>质押</Trans>
                    </Button>
                  )
                }}
                closeable={false}
                content={{ className: 'max-w-[424px] ' }}
              >
                <NumberInput
                  size={'lg'}
                  placeholder={t`请输入...`}
                  value={depositValue}
                  onChange={(ev) => setDepositValue(ev.target.value)}
                />
                <Button
                  className="mt-6 w-full"
                  size={'xl'}
                  variant={'gradient'}
                  isLoading={depositLPTokensLoading}
                  disabled={depositLPTokensLoading}
                  onClick={handleDeposit}
                >
                  <Trans>质押</Trans>
                </Button>
              </Dialog>
              <Dialog
                ref={depositDialog}
                trigger={{
                  asChild: true,
                  children: (
                    <Button className="rounded-2xl text-sm" variant={'primary'} outline>
                      <span className="gradient-text">
                        <Trans>赎回</Trans>
                      </span>
                    </Button>
                  )
                }}
                closeable={false}
                content={{ className: 'max-w-[424px] ' }}
              >
                <NumberInput
                  size={'lg'}
                  placeholder={t`请输入...`}
                  value={withdrawValue}
                  onChange={(ev) => setWithdrawValue(ev.target.value)}
                />
                <Button
                  className="mt-6 w-full"
                  size={'xl'}
                  variant={'gradient'}
                  isLoading={withdrawLPTokensLoading}
                  disabled={withdrawLPTokensLoading}
                  onClick={handleWithdraw}
                >
                  <Trans>赎回</Trans>
                </Button>
              </Dialog>
            </Grid>
          </AmmCard>
          <AmmCard
            title={
              <KanitText variant={'tertiary'} className="text-xs font-bold">
                <Trans>USDT 质押</Trans>
              </KanitText>
            }
            subTitle={
              <KanitText className="flex items-center space-x-1 text-xs" variant={'active'}>
                {formatWithCommas(userInfo?.lpTokensInit ?? '--')} LP
              </KanitText>
            }
          >
            <KeyValue
              classname="mt-6"
              keyNode={
                <KanitText className="relative font-semibold" variant={'tertiary'}>
                  <span className="absolute top-0 -translate-y-full text-xs text-text-active">预估</span>
                  USDT
                </KanitText>
              }
              valueNode={
                <KanitText className="text-2xl font-bold" variant={'primary'}>
                  {formatWithCommas(userInfo?.usdtEstimated ?? '--')}
                </KanitText>
              }
            />
            <Button
              className="mt-6 w-full rounded-2xl text-sm"
              variant={'primary'}
              outline
              isLoading={withdrawInitLPTokensLoading}
              disabled={!userInfo?.usdtEstimated || withdrawInitLPTokensLoading}
              onClick={withdrawInitLPTokens}
            >
              <span className="gradient-text">
                <Trans>赎回 USDT</Trans>
              </span>
            </Button>
          </AmmCard>
        </Grid>
        <Grid className="grid-cols-2 gap-6">
          <AmmCard
            title={
              <KanitText variant={'tertiary'} className="text-xs font-bold">
                <Trans>已累计领取分红</Trans>
              </KanitText>
            }
          >
            <KeyValue
              classname="mt-6"
              keyNode={
                <KanitText className="font-semibold" variant={'tertiary'}>
                  USDT
                </KanitText>
              }
              valueNode={
                <KanitText className="text-2xl font-bold" variant={'primary'}>
                  {formatWithCommas(userInfo?.claimedDividends ?? '--')}
                </KanitText>
              }
            />
          </AmmCard>
          <AmmCard
            title={
              <KanitText variant={'tertiary'} className="text-xs font-bold">
                <Trans>待领取分红</Trans>
              </KanitText>
            }
          >
            <KeyValue
              classname="mt-6"
              keyNode={
                <KanitText className="relative font-semibold" variant={'tertiary'}>
                  USDT
                </KanitText>
              }
              valueNode={
                <KanitText className="text-2xl font-bold" variant={'primary'}>
                  {formatWithCommas(userInfo?.pendingDividends ?? '--')}
                </KanitText>
              }
            />
            <Button
              className="mt-6 w-full rounded-2xl text-sm"
              variant={'gradient'}
              isLoading={claimDividendsLoading}
              disabled={!userInfo?.pendingDividends || claimDividendsLoading}
              onClick={claimDividends}
            >
              <Trans>领取</Trans>
            </Button>
          </AmmCard>
        </Grid>
      </div>
    </>
  )
}

export default Dividend
