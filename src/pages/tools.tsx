import { Token } from '@uniswap/sdk-core'
import React, { useCallback } from 'react'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'

import TokenBalance from '@/components/common/TokenBalance'
import { Grid } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { KanitText } from '@/components/ui/Text'
import { CUSTOM_TOKEN_LIST } from '@/features/token/testnet/bsc'

const Tools: React.FC = () => {
  const { writeContract } = useWriteContract()

  const handleFaucet = useCallback(
    (token: Token) => {
      writeContract({
        abi: [
          {
            inputs: [],
            name: 'faucet',
            outputs: [],
            stateMutability: 'payable',
            type: 'function'
          }
        ],
        functionName: 'faucet',
        address: token.wrapped.address as Address
      })
    },
    [writeContract]
  )

  return (
    <div className="pool min-h-screen w-full">
      <div className="mx-auto max-w-[660px] space-y-7 pt-14">
        <KanitText>Faucet</KanitText>
        <Grid className="grid-cols-4 gap-4">
          {CUSTOM_TOKEN_LIST.map((token) => (
            <Button key={token.wrapped.address} onClick={() => handleFaucet(token)}>
              <span>{token.symbol}</span>
              <TokenBalance token={token} />
            </Button>
          ))}
        </Grid>
      </div>
    </div>
  )
}

export default Tools
