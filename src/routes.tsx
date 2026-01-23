import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

import RootLayout from '@/layouts'

export enum RoutePath {
  Home = '/',
  Swap = '/swap',
  Pool = '/pool',
  AddLiquidity = '/pool/add-liquidity',
  Mining = '/mining',
  Positions = '/positions',
  Amm = '/amm',
  AmmDividend = '/amm/dividend',
  Tools = '/tools'
}

export const router = createBrowserRouter([
  {
    path: RoutePath.Home,
    Component: RootLayout,
    children: [
      {
        path: RoutePath.Swap,
        Component: lazy(() => import('@/pages/swap'))
      },
      {
        path: RoutePath.Pool,
        Component: lazy(() => import('@/pages/pool'))
      },
      {
        path: RoutePath.AddLiquidity,
        Component: lazy(() => import('@/pages/addLiquidity'))
      },
      {
        path: RoutePath.Mining,
        Component: lazy(() => import('@/pages/mining'))
      },
      {
        path: RoutePath.Amm,
        Component: lazy(() => import('@/pages/amm/index'))
      },
      {
        path: RoutePath.AmmDividend,
        Component: lazy(() => import('@/pages/amm/dividend'))
      },
      {
        path: RoutePath.Tools,
        Component: lazy(() => import('@/pages/tools'))
      }
    ]
  }
])
