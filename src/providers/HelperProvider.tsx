import React, { PropsWithChildren } from 'react'

import { useTokenList } from '@/hooks/services/useToken'

const HelperProvider: React.FC<PropsWithChildren> = ({ children }) => {
  useTokenList()

  return children
}

export default HelperProvider
