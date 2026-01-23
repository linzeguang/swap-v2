import AmmCard from '@/components/amm/AmmCard'
import KeyValue from '@/components/common/KeyValue'
import { Grid } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { KanitText } from '@/components/ui/Text'
import { Trans } from '@lingui/react/macro'
import React from 'react'

const Dividend: React.FC = () => {
  return (
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
              3,000,0000
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
              32,000,000,0000
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
                32,000,000
              </KanitText>
            }
          />
          <Grid className="mt-6 grid-cols-2 gap-2">
            <Button className="rounded-2xl text-sm" variant="gradient">
              <Trans>质押</Trans>
            </Button>
            <Button className="rounded-2xl text-sm" variant={'primary'} outline>
              <span className="gradient-text">
                <Trans>赎回 </Trans>
              </span>
            </Button>
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
              3,000,000 LP
            </KanitText>
          }
        >
          <KeyValue
            classname="mt-6"
            keyNode={
              <KanitText className="relative font-semibold" variant={'tertiary'}>
                <span className="text-text-active absolute top-0 -translate-y-full text-xs">预估</span>
                USDT
              </KanitText>
            }
            valueNode={
              <KanitText className="text-2xl font-bold" variant={'primary'}>
                32,000,000
              </KanitText>
            }
          />
          <Button className="mt-6 w-full rounded-2xl text-sm" variant={'primary'} outline>
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
                32,000,000
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
                32,000,000
              </KanitText>
            }
          />
          <Button className="mt-6 w-full rounded-2xl text-sm" variant={'gradient'}>
            <Trans>领取</Trans>
          </Button>
        </AmmCard>
      </Grid>
    </div>
  )
}

export default Dividend
