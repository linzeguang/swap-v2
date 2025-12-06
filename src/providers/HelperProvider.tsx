import React, { PropsWithChildren } from 'react'

import { usePairList } from '@/hooks/services/usePair'
import { useTokenList } from '@/hooks/services/useToken'

const HelperProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useTokenList()
  usePairList()

  return children
}

export default HelperProvider
