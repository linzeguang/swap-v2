import { Trans } from '@lingui/react/macro'
import React, { type CSSProperties, useId, useMemo } from 'react'

import { Pagination } from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'

export const TableRoot = React.forwardRef<React.ComponentRef<'table'>, React.TableHTMLAttributes<HTMLTableElement>>(
  (props, ref) => <table ref={ref} {...props} className={cn('w-full table-fixed', props.className)} />
)
export const TableCaption = React.forwardRef<
  React.ComponentRef<'caption'>,
  React.HTMLAttributes<HTMLTableSectionElement>
>((props, ref) => <caption ref={ref} {...props} className={cn('', props.className)} />)
export const TableHead = React.forwardRef<React.ComponentRef<'thead'>, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <thead ref={ref} {...props} className={cn('border-b border-border', props.className)} />
)
export const TableBody = React.forwardRef<React.ComponentRef<'tbody'>, React.HTMLAttributes<HTMLTableSectionElement>>(
  (props, ref) => <tbody ref={ref} {...props} className={cn('', props.className)} />
)
export const TableRow = React.forwardRef<React.ComponentRef<'tr'>, React.HTMLAttributes<HTMLTableRowElement>>(
  (props, ref) => <tr ref={ref} {...props} className={cn('', props.className)} />
)
export const TableHeadCell = React.forwardRef<React.ComponentRef<'th'>, React.ThHTMLAttributes<HTMLTableCellElement>>(
  (props, ref) => (
    <th ref={ref} {...props} className={cn('px-2 py-4 font-Kanit font-bold text-text-tertiary', props.className)} />
  )
)
export const TableDateCell = React.forwardRef<React.ComponentRef<'td'>, React.TdHTMLAttributes<HTMLTableCellElement>>(
  (props, ref) => <td ref={ref} {...props} className={cn('px-2 py-2.5', props.className)} />
)

export const Table = <D extends object>(props: TableProps<D>) => {
  const {
    wrapperClassName,
    columns,
    dataSource,
    // loading,
    rowKey = 'id' as keyof D,
    theadProps,
    therdTrProps,
    thProps,
    tbodyProps,
    tbodyTrProps,
    tdProps,
    pagination,
    scroll,
    ...rest
  } = props
  const id = useId()

  const memoData = useMemo(() => {
    if (!pagination) return dataSource
    const { page, pageSize } = pagination
    return dataSource.slice(pageSize * (page - 1), page * pageSize)
  }, [dataSource, pagination])

  const memoColgroup = useMemo(
    () => (
      <colgroup>
        {columns.map((column) => (
          <col key={column.field.toString()} style={{ width: column.width }} className={column.className} />
        ))}
      </colgroup>
    ),
    [columns]
  )

  return (
    <div id={`table-${id}`} className={cn('overflow-hidden rounded-t-sm', wrapperClassName)}>
      <div className="w-full overflow-x-auto">
        <div style={scroll?.y ? { maxHeight: scroll.y, overflowY: 'auto' } : undefined} className="scrollbar-none">
          <TableRoot {...rest} className={cn('w-full table-auto', rest.className)}>
            {memoColgroup}
            <TableHead
              id={`table-head-${id}`}
              {...theadProps}
              className={cn('z-1 sticky top-0', theadProps?.className)}
            >
              <TableRow {...therdTrProps}>
                {columns.map((column) => (
                  <TableHeadCell
                    key={column.field.toString()}
                    {...thProps}
                    style={{ textAlign: column.align || 'start', ...thProps?.style }}
                    className={column.className}
                  >
                    {column.name}
                  </TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody id={`table-body-${id}`} {...tbodyProps}>
              {memoData.length ? (
                memoData.map((data, index) => (
                  <TableRow
                    key={typeof rowKey === 'function' ? rowKey(data, index) : (data[rowKey] as string)}
                    data-index={index}
                    {...tbodyTrProps}
                  >
                    {columns.map((column) => (
                      <TableDateCell
                        key={column.field.toString()}
                        {...tdProps}
                        style={{ textAlign: column.align || 'start', ...tdProps?.style }}
                        className={cn(column.className, tdProps?.className)}
                      >
                        {column.render?.(data[column.field], data, index) || (data[column.field] as React.ReactNode)}
                      </TableDateCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow key="nodata" {...tbodyTrProps}>
                  <TableDateCell
                    colSpan={columns.length}
                    className="font-HarmonyOSSans py-6 text-center text-text-secondary"
                  >
                    <Trans>No Data</Trans>
                  </TableDateCell>
                </TableRow>
              )}
            </TableBody>
          </TableRoot>
        </div>
      </div>
      {!!dataSource.length && pagination && <Pagination {...pagination} />}
    </div>
  )
}

export interface TableProps<D extends object> extends React.ComponentPropsWithRef<typeof TableRoot> {
  wrapperClassName?: string
  columns: TableColumn<D>[]
  dataSource: D[]
  loading?: boolean
  rowKey?: keyof D | ((data: D, index: number) => string)
  theadProps?: React.ComponentPropsWithRef<typeof TableHead>
  therdTrProps?: React.ComponentPropsWithRef<typeof TableRow>
  thProps?: React.ComponentPropsWithRef<typeof TableHeadCell>
  tbodyProps?: React.ComponentPropsWithRef<typeof TableBody>
  tbodyTrProps?: React.ComponentPropsWithRef<typeof TableRow>
  tdProps?: React.ComponentPropsWithRef<typeof TableDateCell>
  pagination?: React.ComponentPropsWithRef<typeof Pagination>
  scroll?: {
    y?: string | number
  }
}

export type TableColumn<D extends object> = {
  [K in keyof D]: {
    name: React.ReactNode
    field: K
    align?: CSSProperties['textAlign']
    width?: CSSProperties['width']
    className?: string
    render?: (value: D[K], row: D, index: number) => React.ReactNode
  }
}[keyof D]
