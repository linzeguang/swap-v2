import { t } from '@lingui/core/macro'
import React, { useCallback, useImperativeHandle, useState } from 'react'
import { useNavigate } from 'react-router'

import * as Sidebar from '@/components/svgr/sidebar'
import {
  AccordionArrow,
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from '@/components/ui/Accordion'
import { Flex } from '@/components/ui/Box'
import { Dividing } from '@/components/ui/Dividing'
import { KanitText } from '@/components/ui/Text'
import { useTheme } from '@/hooks/useTheme'
import { LOCALES } from '@/i18n'
import { cn } from '@/lib/utils'
import { useI18nLocaleProviderContext } from '@/providers/I18nLocaleProvider'
import { RoutePath } from '@/routes'
import { Theme } from '@/stores/settings'

const Nav = React.forwardRef<
  { closeAccordion: () => void },
  { collapsed: boolean; className?: string; closeMenu?: () => void }
>(({ collapsed, className, closeMenu }, ref) => {
  const navigate = useNavigate()
  const [accordionValue, setAccordionValue] = useState<string>('')

  const { changeTheme } = useTheme()
  const { changeLocale } = useI18nLocaleProviderContext()

  const accordionOptions: Array<
    | {
        name: React.ReactNode
        value: string
        icon: React.FunctionComponent<
          React.SVGProps<SVGSVGElement> & {
            title?: string
            titleId?: string
            desc?: string
            descId?: string
          }
        >
        path?: RoutePath
        childrens?: {
          name: React.ReactNode
          onClick: () => void
        }[]
      }
    | undefined
  > = [
    {
      name: t`Swap`,
      value: 'home',
      icon: Sidebar.Home,
      path: RoutePath.Swap
    },
    {
      name: t`Pool`,
      value: 'pool',
      icon: Sidebar.Tutorial,
      path: RoutePath.Pool
    },
    {
      name: 'Tools',
      value: 'tools',
      icon: Sidebar.Doc,
      path: RoutePath.Tools
    },
    undefined,
    {
      name: t`Theme`,
      value: 'theme',
      icon: Sidebar.Theme,
      childrens: [
        {
          name: t`Light Mode`,
          onClick: () => {
            closeMenu?.()
            changeTheme(Theme.Light)
          }
        },
        {
          name: t`Dark Mode`,
          onClick: () => {
            closeMenu?.()
            changeTheme(Theme.Dark)
          }
        }
      ]
    },
    {
      name: t`Locale`,
      value: 'locale',
      icon: Sidebar.Locale,
      childrens: Object.values(LOCALES).map(({ name, locale }) => ({
        name,
        onClick: () => {
          closeMenu?.()
          changeLocale(locale)
        }
      }))
    }
  ]

  const renderAccordionTrigger = useCallback(
    (option: Exclude<(typeof accordionOptions)[number], undefined>) => {
      return (
        <Flex
          className={cn(
            'flex-1 cursor-pointer items-center hover:text-primary hover:[&_.accordion-arrow]:text-primary',
            collapsed && 'justify-center'
          )}
          onClick={() => {
            if (option.path) {
              navigate(option.path)
            }
          }}
        >
          <option.icon className="w-10" />
          <KanitText
            className={cn('flex-1 overflow-hidden whitespace-nowrap text-sm text-inherit', collapsed && 'w-0')}
          >
            {option.name}
          </KanitText>
          {option.childrens && <AccordionArrow className={cn('text-accordion-arrow', collapsed && 'w-0')} />}
        </Flex>
      )
    },
    [collapsed]
  )

  useImperativeHandle(
    ref,
    () => ({
      closeAccordion: () => setAccordionValue('')
    }),
    []
  )

  return (
    <AccordionRoot
      className={cn('space-y-3.5', className)}
      type="single"
      collapsible
      value={accordionValue}
      onValueChange={setAccordionValue}
    >
      {accordionOptions.map((option, index) =>
        !option ? (
          <Dividing key={index} />
        ) : (
          <AccordionItem key={option.value} value={option.value}>
            {option.childrens ? (
              <>
                <AccordionTrigger showArrow={false}>{renderAccordionTrigger(option)}</AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-1 text-balance">
                  {option.childrens.map((children, i) => (
                    <a
                      key={i}
                      className="bg-background-tertiary block cursor-pointer py-1 pl-10 text-xs hover:text-primary"
                      onClick={(ev) => {
                        ev.preventDefault()
                        children.onClick()
                      }}
                    >
                      {children.name}
                    </a>
                  ))}
                </AccordionContent>
              </>
            ) : (
              renderAccordionTrigger(option)
            )}
          </AccordionItem>
        )
      )}
    </AccordionRoot>
  )
})

export default Nav
