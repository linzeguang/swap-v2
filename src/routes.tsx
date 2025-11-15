import { lazy } from 'react'
import { createBrowserRouter } from 'react-router'

import RootLayout from '@/layouts'

export enum ROUTE_PATH {
  Swap = '/',
  Pool = '/pool'
}

export const router = createBrowserRouter([
  {
    path: ROUTE_PATH.Swap,
    Component: RootLayout,
    children: [
      {
        index: true,
        path: ROUTE_PATH.Swap,
        Component: lazy(() => import('@/pages/swap'))
      },
      {
        path: ROUTE_PATH.Pool,
        Component: lazy(() => import('@/pages/pool'))
      }
    ]
  }
])
