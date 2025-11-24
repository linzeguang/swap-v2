import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

import RootLayout from '@/layouts'

export enum RoutePath {
  Swap = '/',
  Pool = '/pool',
  Positions = '/positions'
}

export const router = createBrowserRouter([
  {
    path: RoutePath.Swap,
    Component: RootLayout,
    children: [
      {
        index: true,
        path: RoutePath.Swap,
        Component: lazy(() => import('@/pages/swap'))
      },
      {
        path: RoutePath.Pool,
        Component: lazy(() => import('@/pages/pool'))
      }
    ]
  }
])
