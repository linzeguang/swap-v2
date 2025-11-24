import { i18n } from '@lingui/core'

export enum Locale {
  EN = 'en',
  ZH = 'zh'
}

export const LOCALES: Record<Locale, { name: string; locale: Locale }> = {
  [Locale.EN]: {
    name: 'English',
    locale: Locale.EN
  },
  [Locale.ZH]: {
    name: '简体中文',
    locale: Locale.ZH
  }
}

export const importLocale = async (locale: Locale) => {
  const res = await fetch(`/locales/${locale}/messages.json`)
  const data = await res.json()

  i18n.load(locale, data.messages)
  i18n.activate(locale)
}

export default i18n
