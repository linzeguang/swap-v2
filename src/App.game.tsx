import React from 'react'

import { BorderCard, Grid } from './components/ui/Box'
import { Button } from './components/ui/Button'
import { KanitText } from './components/ui/Text'

const AppGame: React.FC = () => {
  return (
    <BorderCard className="mx-4 mt-[10vh] space-y-6">
      <KanitText variant={'primary'} className="text-xs [&_b]:text-primary">
        <p>
          欢迎回来，正在提炼的 <b>UCO</b> 有 <b>10</b> 笔
        </p>
        <p>
          最近的一笔剩余时间为 <b>24:00</b>
        </p>
      </KanitText>
      <div>
        <KanitText variant={'secondary'} className="text-xs">
          接下来，我们准备干什么?
        </KanitText>
        <Grid className="grid-cols-2">
          <Button variant={'dialog'}>探索</Button>
        </Grid>
      </div>
    </BorderCard>
  )
}

export default AppGame
