import { Trans } from '@lingui/react/macro'
import React from 'react'

import AddLiquidityForm from '@/components/pool/AddLiquidityForm'
import VersionSelect from '@/components/pool/VersionSelect'
import { Flex } from '@/components/ui/Box'
import { PageTitle } from '@/components/ui/Text'

const Pool: React.FC = () => {
  return (
    <Flex className="w-full flex-col justify-center space-y-6 py-4 pt-4 lg:flex-row lg:space-x-8 lg:space-y-0 lg:pt-14">
      <div className="max-w-[660px] space-y-4 lg:space-y-7">
        <PageTitle>
          <Trans>Pool</Trans>
        </PageTitle>
        <Flex className="items-center justify-between">
          <VersionSelect />
          {/* <PositionNav /> */}
        </Flex>
        <AddLiquidityForm />
      </div>
    </Flex>
  )
}

export default Pool
