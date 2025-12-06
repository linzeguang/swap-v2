import { Trans } from '@lingui/react/macro'
import React from 'react'

import AddLiquidityForm from '@/components/pool/AddLiquidityForm'
import VersionSelect from '@/components/pool/VersionSelect'
import { Flex } from '@/components/ui/Box'
import { PageTitle } from '@/components/ui/Text'

const Pool: React.FC = () => {
  return (
    <div className="pool w-full">
      <div className="mx-auto max-w-[660px] space-y-4 py-4 pt-4 lg:space-y-7 lg:pt-14">
        <PageTitle>
          <Trans>Pool</Trans>
        </PageTitle>
        <Flex className="items-center justify-between">
          <VersionSelect />
          {/* <PositionNav /> */}
        </Flex>
        <AddLiquidityForm />
      </div>
    </div>
  )
}

export default Pool
