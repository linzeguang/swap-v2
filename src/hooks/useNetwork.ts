import { useEffect } from 'react'
import { useConnect } from 'wagmi'

export const useEvm = () => {
  const { connect } = useConnect()

  useEffect(() => {
    console.log('>>>>>> window: ', window)
    if (window.tokenpocket.ethereum.ready) {
      console.log('>>>>>> window: tokenpocket', window.tokenpocket.ethereum.on)

      // window.tokenpocket.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
      //   console.log('>>>>>> tokenpocket accounts: ', accounts)

      //   const tokenPocketInjected = injected({
      //     target: {
      //       id: 'tokenPocketInjected',
      //       name: 'tokenPocketInjected',
      //       provider: (window) => window.tokenpocket.ethereum
      //     }
      //   })
      //   connect({
      //     connector: (config) => {
      //       console.log('>>>>>> config: ', config)

      //       const connector = tokenPocketInjected(config)
      //       connector.connect({ chainId: 56 }).then(console.log)
      //       connector.getAccounts().then(console.log)
      //       console.log('>>>>>> connector: ', connector)
      //       return connector
      //     }
      //   })
      // })
      // for (const key in window.tokenpocket.ethereum) {
      //   console.log('>>>>>> window.tokenpocket.ethereum: ', key, window.tokenpocket.ethereum[key])
      // }
    }
  }, [connect])
}
