import { useAtom } from 'jotai/react'
import { useCallback } from 'react'

import { Theme, themeAtom } from '@/stores/settings'

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom)

  const changeTheme = useCallback(
    (theme: Theme) => {
      setTheme(theme)
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'

      if (theme !== currentTheme) document.documentElement.classList.toggle('dark')
    },
    [setTheme]
  )

  return {
    theme,
    changeTheme
  }
}
