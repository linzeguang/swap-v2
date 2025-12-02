import { Trans } from '@lingui/react/macro'
import { useAtom } from 'jotai/react'
import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react'

import { Direction } from '@/constants/enum'
import { cn } from '@/lib/utils'
import { deadlineAtom, infiniteApprovalAtom, slippageAtom } from '@/stores/settings'

import { Help, Setting } from '../svgr/icons'
import { Flex } from '../ui/Box'
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

const SlippageField: React.FC = () => {
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
        <Flex className="items-center space-x-2">
          <KanitText>
            <Trans>Slippage Tolerance</Trans>
          </KanitText>
          <Help className="text-icon" />
          {/* <Tooltip trigger={{ children: <Help className="text-icon" /> }}>
              <KanitText>
                <Trans>Slippage Tolerance</Trans>
              </KanitText>
            </Tooltip> */}
        </Flex>
      }
    >
      <Flex className="space-x-4">
        {slippageOptions.map((option) => (
          <Button
            key={option.value}
            variant={'secondary'}
            outline={slippage !== option.value}
            onClick={() => handleSlippage(option.value)}
          >
            {option.lable}
          </Button>
        ))}
        <NumberInput
          border
          wrapperProps={{ className: 'flex-1' }}
          className="w-full text-right"
          size={'sm'}
          decimals={2}
          max={100}
          suffixNode={<KanitText className="text-secondary">%</KanitText>}
          value={slippageValue}
          onChange={(ev) => {
            handleSlippageValue(ev.target.value)
          }}
        />
      </Flex>
    </Field>
  )
}

const DeadlineField: React.FC = () => {
  const [deadline, setDeadline] = useAtom(deadlineAtom)

  const handleDeadline = useCallback(
    (value: number) => {
      setDeadline(value)
    },
    [setDeadline]
  )

  return (
    <Field
      direction={Direction.Vertical}
      name={
        <Flex className="items-center space-x-2">
          <KanitText>
            <Trans>Transaction Deadline</Trans>
          </KanitText>
          <Help className="text-icon" />
        </Flex>
      }
    >
      <NumberInput
        border
        className="text-right"
        size={'sm'}
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

const InfiniteApprovalField: React.FC = () => {
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
        <Flex className="items-center space-x-2">
          <KanitText>
            <Trans>Infinite Approval</Trans>
          </KanitText>
          <Help className="text-icon" />
        </Flex>
      }
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
