import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'

import { Result } from '@/hooks/services/types'
import fetcher, { METHOD } from '@/lib/fetcher'

export const useFetch = <T, D = any, R = Result<T>>(parmas: {
  url: string | null
  method?: METHOD
  data?: D
  config?: RequestInit
  options?: Parameters<typeof useSWR<R>>[2]
}) => {
  const { url, method, data, config, options } = parmas

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const resp = useSWR<R>(
    {
      url,
      method,
      data,
      config: { ...config }
    },
    fetcher,
    {
      errorRetryCount: 5,
      dedupingInterval: 5000,
      revalidateOnFocus: false,
      ...options
    }
  )

  return resp
}

export const useMutationFetch = <T, D = any, R = Result<T>>(parmas: {
  url: string | null
  method?: METHOD
  data?: D
  config?: RequestInit
  options?: Parameters<typeof useSWR<R>>[2]
}) => {
  const { url, method, data, config } = parmas

  const resp = useSWRMutation<R>(url, (url: string, { arg }: { arg: any }) =>
    fetcher({
      url,
      method: method || METHOD.GET,
      data: { ...data, ...arg },
      config: { ...config }
    })
  )

  return resp
}
