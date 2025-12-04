import { useMemo } from 'react'
import { createBreakpoint } from 'react-use'

// use tailwindcss breakpoint
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920
}

export const useBreakpoint = createBreakpoint(breakpoints)

const useMediaQuery = () => {
  const breakpoint = useBreakpoint()

  return useMemo(
    () => ({
      isSM: breakpoint === 'sm',
      isMD: breakpoint === 'md',
      isLG: breakpoint === 'lg',
      isXL: breakpoint === 'xl',
      is2XL: breakpoint === '2xl',
      is3XL: breakpoint === '3xl',
      gt3XL: breakpoint === '3xl',
      gt2XL: ['2xl', '3xl'].includes(breakpoint),
      gtXL: ['xl', '2xl', '3xl'].includes(breakpoint),
      gtLG: ['lg', 'xl', '2xl', '3xl'].includes(breakpoint),
      gtMD: ['md', 'lg', 'xl', '2xl', '3xl'].includes(breakpoint),
      isMobile: !['lg', 'xl', '2xl', '3xl'].includes(breakpoint)
    }),
    [breakpoint]
  )
}

export default useMediaQuery
