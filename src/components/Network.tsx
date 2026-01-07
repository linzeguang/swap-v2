import React from 'react'

import { BscIcon } from './svgr/chain'
import { Button } from './ui/Button'
import { KanitText } from './ui/Text'

const Network: React.FC = () => {
  return (
    <Button size={'lg'} className="bg-bsc">
      <BscIcon />
      <KanitText className="text-background">BSC Chain</KanitText>
    </Button>
  )
}

export default Network
