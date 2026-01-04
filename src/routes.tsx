import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

import RootLayout from '@/layouts'

export enum RoutePath {
  Home = '/',
  Swap = '/swap',
  Pool = '/pool',
  Positions = '/positions',
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
        path: RoutePath.Tools,
        Component: lazy(() => import('@/pages/tools'))
      }
    ]
  }
])
