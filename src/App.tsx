import { useAtomValue } from 'jotai/react'
import React from 'react'
import { createPortal } from 'react-dom'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router'

import V2Provider from './features/v2/provider'
import { router } from './routes'
import { deadlineAtom, infiniteApprovalAtom, slippageAtom } from './stores/settings'

const App: React.FC = () => {
  const infiniteApproval = useAtomValue(infiniteApprovalAtom)
  const slippage = useAtomValue(slippageAtom)
  const deadline = useAtomValue(deadlineAtom)
  return (
    <>
      <V2Provider infiniteApproval={infiniteApproval} slippagePercent={slippage} deadlineMinutes={deadline}>
        <RouterProvider router={router} />
      </V2Provider>
      {createPortal(
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--color-content))',
              color: 'hsl(var(--color-text-primary))',
              border: '1px solid hsl(var(--color-border))'
            },
            removeDelay: 60 * 1000
          }}
        />,
        document.body
      )}
    </>
  )
}

export default App
