export enum METHOD {
  GET = 'GET',
  POST = 'POST'
}

// [url, method, data, config]: [string | null, METHOD, any, RequestInit | undefined]

const fetcher = async <T = any>({
  url,
  method,
  data,
  config
}: {
  url: string | null
  method: METHOD
  data?: any
  config?: RequestInit
}) => {
  if (!url) return

  // 拼接请求url

  // if (import.meta.env.MODE === 'production') url = import.meta.env.VITE_API_TARGET_URL + '/api' + url
  // else url = import.meta.env.VITE_API_BASE_URL + url
  url = import.meta.env.VITE_API_BASE_URL + url
  console.log('>>>>>> url: ', url)

  // 初始化body数据
  let body: BodyInit | undefined
  if (method === METHOD.GET && data) url += `?${new URLSearchParams(data)}`
  else if (data instanceof FormData) body = data
  else body = JSON.stringify(data)

  const res = await fetch(url, {
    body,
    method,
    ...config
  })

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // 将额外的信息附加到错误对象上。
    error.message = await res.json()
    throw error
  }

  const resp = (await res.json()) as T

  console.log('>>>>>> fetcher: ', url, { resp })

  return resp
}

export default fetcher
