import React, { useMemo } from 'react'

import KeyValue from '@/components/common/KeyValue'
import { ExternalLink, Locale } from '@/components/svgr/icons'
import {
  ContactDiscord,
  ContactGithub,
  ContactReddit,
  ContactTelegram,
  ContactX,
  ExternalLinkDocs,
  ExternalLinkHelp,
  ExternalLinkMore,
  ThemeDark,
  ThemeLight
} from '@/components/svgr/sidebar'
import { Flex, Grid } from '@/components/ui/Box'
import { KanitText } from '@/components/ui/Text'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from '@/hooks/useTheme'
import { LOCALES } from '@/i18n'
import { useI18nLocaleProviderContext } from '@/providers/I18nLocaleProvider'
import { Theme } from '@/stores/settings'

const MoreAction: React.FC = () => {
  const { theme, changeTheme } = useTheme()
  const { locale: currentLocale, changeLocale } = useI18nLocaleProviderContext()

  const contacts = useMemo(
    () => [
      {
        Icon: ContactGithub,
        href: ''
      },
      {
        Icon: ContactX,
        href: ''
      },
      {
        Icon: ContactDiscord,
        href: ''
      },
      {
        Icon: ContactTelegram,
        href: ''
      },
      {
        Icon: ContactReddit,
        href: ''
      }
    ],
    []
  )

  return (
    <div>
      <div className="border-t border-border">
        <KeyValue
          classname="px-6"
          keyNode={
            <Flex className="items-center justify-between">
              <Flex className="items-center space-x-1">
                <ExternalLinkDocs />
                <KanitText className="text-sm text-text-tertiary">Docs</KanitText>
              </Flex>
            </Flex>
          }
          valueNode={<ExternalLink />}
        />
        <KeyValue
          classname="px-6"
          keyNode={
            <Flex className="items-center justify-between">
              <Flex className="items-center space-x-1">
                <ExternalLinkHelp />
                <KanitText className="text-sm text-text-tertiary">Help</KanitText>
              </Flex>
            </Flex>
          }
          valueNode={<ExternalLink />}
        />
      </div>
      <div className="border-t border-border">
        <KeyValue
          classname="px-6"
          keyNode={
            <Flex className="items-center justify-between">
              <Flex className="items-center space-x-1">
                <ExternalLinkMore />
                <KanitText className="text-sm text-text-tertiary">More</KanitText>
              </Flex>
            </Flex>
          }
        />
      </div>
      <Flex className="items-center justify-center border-t border-border py-2">
        <Grid className="grid-cols-5 gap-3">
          {contacts.map(({ Icon }, index) => (
            <Icon key={index} />
          ))}
        </Grid>
      </Flex>
      <div className="border-t border-border py-2">
        <KeyValue
          classname="px-6"
          keyNode={'V1.0.1'}
          valueNode={
            <Flex>
              {theme === Theme.Dark ? (
                <ThemeDark onClick={() => changeTheme(Theme.Light)} />
              ) : (
                <ThemeLight onClick={() => changeTheme(Theme.Dark)} />
              )}

              <Tooltip trigger={{ children: <Locale /> }}>
                <div className="space-y-2 p-2">
                  {Object.values(LOCALES).map((locale) => (
                    <KanitText
                      key={locale.locale}
                      variant={locale.locale === currentLocale ? 'primary' : 'tertiary'}
                      className="cursor-pointer text-sm"
                      onClick={() => changeLocale(locale.locale)}
                    >
                      {locale.name}
                    </KanitText>
                  ))}
                </div>
              </Tooltip>
            </Flex>
          }
        />
      </div>
    </div>
  )
}

export default MoreAction
