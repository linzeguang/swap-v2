import { i18n } from '@lingui/core'

export enum LOCALE {
  EN = 'en',
  ZH = 'zh'
}

export const LOCALES: Record<LOCALE, { name: string; locale: LOCALE }> = {
  [LOCALE.EN]: {
    name: 'English',
    locale: LOCALE.EN
  },
  [LOCALE.ZH]: {
    name: '简体中文',
    locale: LOCALE.ZH
  }
}

export const importLocale = async (locale: LOCALE) => {
  const res = await fetch(`/locales/${locale}/messages.json`)
  const data = await res.json()

  i18n.load(locale, data.messages)
  i18n.activate(locale)
}

export default i18n
