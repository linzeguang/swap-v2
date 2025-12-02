import { useAtomValue } from 'jotai/react'
import React from 'react'
import { RouterProvider } from 'react-router'

import V2Provider from './features/v2/provider'
import { router } from './routes'
import { deadlineAtom, slippageAtom } from './stores/settings'

const App: React.FC = () => {
  const slippage = useAtomValue(slippageAtom)
  const deadline = useAtomValue(deadlineAtom)
  return (
    <V2Provider slippagePercent={slippage} deadlineMinutes={deadline}>
      <RouterProvider router={router} />
    </V2Provider>
  )
}

export default App
