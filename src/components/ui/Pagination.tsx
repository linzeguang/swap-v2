import React, { useCallback, useMemo } from 'react'

import * as Icons from '@/components/svgr/icons'
import { Flex } from '@/components/ui/Box'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
export interface PaginationProps {
  className?: string | undefined
  pageSize: number
  page: number
  total: number
  onChange?: (data: { pageSize: number; page: number }) => void
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { className, page, pageSize, total, onChange } = props

  const getRange = useCallback(
    (n: number) => {
      const totalPages = Math.ceil(total / pageSize)

      if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
      const min = 1
      const max = totalPages
      const result: number[] = []

      // 先构造最大可能范围
      for (let i = n - 2; i <= n + 2; i++) {
        if (i >= min && i <= max) {
          result.push(i)
        }
      }

      // 补足长度为 5，从右往右扩展，然后从左往左扩展
      let next = result[result.length - 1] + 1
      while (result.length < 5 && next <= max) {
        result.push(next++)
      }

      let prev = result[0] - 1
      while (result.length < 5 && prev >= min) {
        result.unshift(prev--)
      }

      return result
    },
    [pageSize, total]
  )

  const { isFirst, isLast, lastPage, pageNums } = useMemo(() => {
    const pageNums = Math.ceil(total / pageSize)

    console.log('>>>>>> getRange(page): ', getRange(page))

    return {
      isFirst: page === 1,
      isLast: page === pageNums,
      lastPage: pageNums,
      pageNums: getRange(page)
    }
  }, [getRange, page, pageSize, total])

  const renderPageNum = useCallback(
    (pageNum: number) => {
      return (
        <Button
          variant="primary"
          outline={pageNum !== page}
          size="xs"
          key={pageNum}
          className={cn(
            'font-HarmonyOSSans text-xs leading-none',
            pageNum !== page ? 'text-text-primary' : '!border-primary'
          )}
          onClick={() => {
            if (!onChange) return
            onChange({
              page: pageNum,
              pageSize
            })
          }}
        >
          {pageNum}
        </Button>
      )
    },
    [onChange, page, pageSize]
  )

  return (
    <Flex
      className={cn(
        'justify-center space-x-1.5',
        '[&_button]:border-border-pagination [&_button]:!rounded-xs [&_button]:size-6 [&_button]:px-0',
        className
      )}
    >
      <Button
        key="prev"
        size="xs"
        outline={isFirst}
        className={isFirst ? 'cursor-not-allowed' : ''}
        onClick={() => {
          if (isFirst) return
          if (!onChange) return
          onChange({
            page: page - 1,
            pageSize
          })
        }}
      >
        <Icons.Prev />
      </Button>
      {pageNums[0] > 1 && renderPageNum(1)}
      {pageNums[0] > 2 && (
        <Button ghost disabled>
          <Icons.Omit />
        </Button>
      )}
      {pageNums.map((pageNum) => renderPageNum(pageNum))}
      {lastPage - pageNums[3] > 2 && (
        <Button ghost disabled>
          <Icons.Omit />
        </Button>
      )}
      {lastPage - pageNums[4] >= 1 && renderPageNum(lastPage)}
      <Button
        key="next"
        // variant="fourth"
        size="xs"
        outline
        className={isLast ? 'cursor-not-allowed' : ''}
        onClick={() => {
          if (isLast) return
          if (!onChange) return
          onChange({
            page: page + 1,
            pageSize
          })
        }}
      >
        <Icons.Next />
      </Button>
    </Flex>
  )
}
