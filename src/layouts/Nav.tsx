import { t } from '@lingui/core/macro'
import React, { useImperativeHandle, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useHover } from 'react-use'

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
import { LOCALES } from '@/i18n'
import { cn } from '@/lib/utils'
import { useI18nLocaleProviderContext } from '@/providers/I18nLocaleProvider'
import { RoutePath } from '@/routes'

const AccordionTriggerChildren: React.FC<{
  option: {
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
    iconActive: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & {
        title?: string
        titleId?: string
        desc?: string
        descId?: string
      }
    >
    path?: RoutePath
    onClick?: () => void
    childrens?: {
      name: React.ReactNode
      onClick: () => void
    }[]
  }
  collapsed: boolean
}> = ({ option, collapsed }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [hoverable] = useHover((hovered) => (
    <Flex
      className={cn(
        'hover:gradient-text flex-1 cursor-pointer items-center px-6 py-2.5 text-text-primary',
        pathname === option.path && 'gradient-text bg-red-100',
        collapsed && 'justify-center'
      )}
      onClick={() => {
        option.onClick?.()
        if (option.path) {
          navigate(option.path)
        }
      }}
    >
      {hovered || pathname === option.path ? <option.iconActive className="w-10" /> : <option.icon className="w-10" />}
      <KanitText className={cn('text flex-1 overflow-hidden whitespace-nowrap text-sm', collapsed && 'w-0')}>
        {option.name}
      </KanitText>
      {option.childrens && <AccordionArrow className={cn('text-accordion-arrow', collapsed && 'w-0')} />}
    </Flex>
  ))

  return hoverable
}

const Nav = React.forwardRef<
  { closeAccordion: () => void },
  { collapsed: boolean; className?: string; closeMenu?: () => void }
>(({ collapsed, className, closeMenu }, ref) => {
  const [accordionValue, setAccordionValue] = useState<string>('')

  const { changeLocale } = useI18nLocaleProviderContext()

  const accordionOptions: Array<React.ComponentPropsWithRef<typeof AccordionTriggerChildren>['option'] | undefined> = [
    {
      name: t`Home`,
      value: 'home',
      icon: Sidebar.Home,
      iconActive: Sidebar.HomeActive,
      path: RoutePath.Home,
      onClick: () => {
        closeMenu?.()
      }
    },
    {
      name: t`Swap`,
      value: 'swap',
      icon: Sidebar.Swap,
      iconActive: Sidebar.SwapActive,
      path: RoutePath.Swap,
      onClick: () => {
        closeMenu?.()
      }
    },
    {
      name: t`Pool`,
      value: 'pool',
      icon: Sidebar.Pool,
      iconActive: Sidebar.Poolactive,
      path: RoutePath.Pool,
      onClick: () => {
        closeMenu?.()
      }
    },
    // {
    //   name: 'Tools',
    //   value: 'tools',
    //   icon: Sidebar.Tutorial,
    //   iconActive: Sidebar.TutorialActive,
    //   path: RoutePath.Tools,
    //   onClick: () => {
    //     closeMenu?.()
    //   }
    // },
    // undefined,
    // {
    //   name: t`Theme`,
    //   value: 'theme',
    //   icon: Sidebar.Theme,
    //   iconActive: Sidebar.ThemeActive,
    //   childrens: [
    //     {
    //       name: t`Light Mode`,
    //       onClick: () => {
    //         closeMenu?.()
    //         changeTheme(Theme.Light)
    //       }
    //     },
    //     {
    //       name: t`Dark Mode`,
    //       onClick: () => {
    //         closeMenu?.()
    //         changeTheme(Theme.Dark)
    //       }
    //     }
    //   ]
    // },
    {
      name: t`Locale`,
      value: 'locale',
      icon: Sidebar.Locale,
      iconActive: Sidebar.LocaleActive,
      childrens: Object.values(LOCALES).map(({ name, locale }) => ({
        name,
        onClick: () => {
          closeMenu?.()
          changeLocale(locale)
        }
      }))
    }
  ]

  useImperativeHandle(
    ref,
    () => ({
      closeAccordion: () => setAccordionValue('')
    }),
    []
  )

  return (
    <AccordionRoot
      className={cn('', className)}
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
                <AccordionTrigger showArrow={false}>
                  <AccordionTriggerChildren option={option} collapsed={collapsed} />
                </AccordionTrigger>
                <AccordionContent className="flex flex-col space-y-1 text-balance">
                  {option.childrens.map((children, i) => (
                    <a
                      key={i}
                      className="hover:gradient-text block cursor-pointer py-1 pl-10 text-xs text-secondary"
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
              <AccordionTriggerChildren option={option} collapsed={collapsed} />
            )}
          </AccordionItem>
        )
      )}
    </AccordionRoot>
  )
})

export default Nav
