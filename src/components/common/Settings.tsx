import { Trans } from '@lingui/react/macro'
import { useAtom } from 'jotai/react'
import React, { ComponentPropsWithRef, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'

import { Direction } from '@/constants/enum'
import { cn } from '@/lib/utils'
import { deadlineAtom, infiniteApprovalAtom, slippageAtom } from '@/stores/settings'

import { Setting } from '../svgr/icons'
import { Flex, Grid } from '../ui/Box'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { NumberInput } from '../ui/Input'
import { Switch } from '../ui/Switch'
import { KanitText } from '../ui/Text'

const Field: React.FC<PropsWithChildren<{ name: React.ReactNode; direction?: Direction }>> = ({
  name,
  direction = Direction.Horizontal,
  children
}) => {
  return (
    <Flex
      className={cn(
        'border-b border-border-thin py-5 last:border-0',
        direction === Direction.Horizontal ? 'flex-col space-y-6' : 'items-center justify-between space-x-6'
      )}
    >
      <KanitText>{name}</KanitText>
      {children}
    </Flex>
  )
}

export const SlippageField: React.FC<Partial<ComponentPropsWithRef<typeof Field>> & { inSide?: boolean }> = ({
  inSide,
  ...props
}) => {
  const [slippage, setSlippage] = useAtom(slippageAtom)
  const [slippageValue, setSlippageValue] = useState('')

  const slippageOptions = useMemo(
    () => [
      {
        lable: '0.1%',
        value: 0.1
      },
      {
        lable: '0.5%',
        value: 0.5
      },
      {
        lable: '1%',
        value: 1
      }
    ],
    []
  )

  const handleSlippage = useCallback(
    (value: number) => {
      setSlippage(value)
      setSlippageValue('')
    },
    [setSlippage]
  )

  const handleSlippageValue = useCallback(
    (value: string) => {
      setSlippageValue(value)
      setSlippage(Number(value))
    },
    [setSlippage]
  )

  useEffect(() => {
    const slippageOptionValues = slippageOptions.map(({ value }) => value)
    if (!slippageOptionValues.includes(slippage)) {
      setSlippageValue(slippage.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Field
      name={
        <Flex className="items-center space-x-2 text-text-tertiary">
          <KanitText>
            <Trans>Slippage Tolerance</Trans>
          </KanitText>
          {/* <Help className="text-icon" /> */}
          {/* <Tooltip trigger={{ children: <Help className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
        </Flex>
      }
      {...props}
    >
      <Grid className={cn('gap-3', !inSide && 'grid-cols-[auto_1fr]')}>
        <Grid className="grid-cols-3 gap-3">
          {slippageOptions.map((option) => (
            <Button
              key={option.value}
              size={'lg'}
              onHoveredOutline={(hovered) => (hovered ? false : slippage !== option.value)}
              onHoveredVariant={(hovered) =>
                hovered ? 'gradient' : slippage === option.value ? 'gradient' : 'secondary'
              }
              onClick={() => handleSlippage(option.value)}
            >
              {option.lable}
            </Button>
          ))}
        </Grid>
        <NumberInput
          // border
          wrapperProps={{ className: 'flex-1' }}
          className="w-full text-right"
          size={'md'}
          decimals={2}
          max={100}
          suffixNode={<KanitText className="text-secondary">%</KanitText>}
          value={slippageValue}
          onChange={(ev) => {
            handleSlippageValue(ev.target.value)
          }}
        />
      </Grid>
    </Field>
  )
}

export const DeadlineField: React.FC<Partial<ComponentPropsWithRef<typeof Field>>> = (props) => {
  const [deadline, setDeadline] = useAtom(deadlineAtom)

  const handleDeadline = useCallback(
    (value: number) => {
      setDeadline(value)
    },
    [setDeadline]
  )

  return (
    <Field
      name={
        <Flex className="items-center space-x-2 text-text-tertiary">
          <KanitText>
            <Trans>Transaction Deadline</Trans>
          </KanitText>
          {/* <Help className="text-icon" /> */}
        </Flex>
      }
      {...props}
    >
      <NumberInput
        className="text-right"
        size={'md'}
        decimals={0}
        max={100}
        suffixNode={
          <KanitText className="text-secondary">
            <Trans>minutes</Trans>
          </KanitText>
        }
        value={deadline}
        onChange={(ev) => {
          handleDeadline(Number(ev.target.value))
        }}
      />
    </Field>
  )
}

export const InfiniteApprovalField: React.FC<Partial<ComponentPropsWithRef<typeof Field>>> = (props) => {
  const [infiniteApproval, setInfiniteApproval] = useAtom(infiniteApprovalAtom)

  const handleInfiniteApproval = useCallback(
    (value: boolean) => {
      setInfiniteApproval(value)
    },
    [setInfiniteApproval]
  )

  return (
    <Field
      direction={Direction.Vertical}
      name={
        <Flex className="items-center space-x-2 text-text-tertiary">
          <KanitText>
            <Trans>Infinite Approval</Trans>
          </KanitText>
          {/* <Help className="text-icon" /> */}
        </Flex>
      }
      {...props}
    >
      <Switch checked={infiniteApproval} onCheckedChange={handleInfiniteApproval} />
    </Field>
  )
}

const Settings: React.FC = () => {
  return (
    <Dialog
      title={<Trans>Settings</Trans>}
      titleClassName="pb-6 border-b border-border-thin"
      trigger={{
        children: <Setting className="text-secondary" />
      }}
      content={{ className: 'max-w-[746px]' }}
    >
      <SlippageField />
      <DeadlineField />
      <InfiniteApprovalField />
    </Dialog>
  )
}

export default Settings
