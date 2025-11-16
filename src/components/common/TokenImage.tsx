import { Currency } from '@uniswap/sdk-core'
import React, { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { Setting } from '../svgr/icons'
import { Flex } from '../ui/Box'
import { TokenSkeleton } from '../ui/Skeleton'

enum Status {
  Error = -1,
  Loading = 0,
  Success = 1
}

const TokenImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { token: Currency }> = ({ token, ...props }) => {
  const [loadingStatus, setLoadingStatus] = useState(Status.Loading)

  const imgSrc = useMemo(
    () =>
      token.isNative
        ? `https://assets.pancakeswap.finance/web/native/${token.chainId}.png`
        : `https://tokens.pancakeswap.finance/images/symbol/${token.symbol?.toLowerCase()}.png`,
    [token]
  )

  return (
    <div className="relative">
      {loadingStatus === Status.Loading && (
        <TokenSkeleton className={cn('absolute bottom-0 left-0 right-0 top-0', props.className)} />
      )}
      {loadingStatus === Status.Error && (
        <Flex
          className={cn(
            'absolute bottom-0 left-0 right-0 top-0 items-center justify-center rounded-full bg-input-bg',
            props.className
          )}
        >
          <Setting className="size-3/4 text-secondary opacity-40" />
        </Flex>
      )}
      <img
        src={imgSrc}
        alt={token.wrapped.address}
        {...props}
        className={cn('size-6 rounded-full', props.className)}
        onLoad={() => setLoadingStatus(Status.Success)}
        onError={() => setLoadingStatus(Status.Error)}
      />
    </div>
  )
}

export default TokenImage
