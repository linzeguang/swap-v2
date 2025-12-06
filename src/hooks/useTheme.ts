import { useAtom } from 'jotai/react'
import { useCallback } from 'react'

import { Theme, themeAtom } from '@/stores/settings'

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom)

  const changeTheme = useCallback(
    (theme: Theme) => {
      setTheme(theme)
      const currentTheme = document.documentElement.classList.contains(Theme.Dark) ? Theme.Dark : Theme.Light

      if (theme !== currentTheme) document.documentElement.classList.toggle(Theme.Dark)
    },
    [setTheme]
  )

  return {
    theme,
    changeTheme
  }
}
