// useCopy.tsx
import { t } from '@lingui/core/macro'
import ClipboardJS from 'clipboard'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

export function useCopy(text: string) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!buttonRef.current) return
    const clipboard = new ClipboardJS(buttonRef.current, {
      text: () => text // 动态传入文本
    })

    clipboard.on('success', (e) => {
      console.log('>>>>>> clipboard: success', e)
      toast.success(t`copied`)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1500)
    })
    clipboard.on('error', (e) => {
      console.log('>>>>>> clipboard: error', e)
      toast.error(t`The current browser environment does not support copying to the clipboard`)
      setIsCopied(false)
    })

    return () => clipboard.destroy()
  }, [text])

  return { buttonRef, isCopied }
}
