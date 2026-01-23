import { readdirSync, readFileSync, statSync } from 'fs'
import { extname, join } from 'path'

const zhRegex = /(['"`])([^\n"'`\u4E00-\u9FA5]*[\u4E00-\u9FA5][^\n"'`]*)(['"`])/g

// 读取文件
function readFile(filePath: string) {
  const ext = extname(filePath).toLowerCase()
  if (!['.ts', '.tsx', '.vue'].includes(ext)) return
  console.log(`➤ 开始查找 ${filePath}`)
  const content = readFileSync(filePath, { encoding: 'utf8' })
  const list = content.toString().split('\n')
  for (const item of list) {
    if (item.includes('//') || item.includes('*') || item.includes('console.')) {
      continue
    }
    const patrn = /[\u4E00-\u9FA5\uFE30-\uFFA0]/g
    if (!patrn.exec(item)) continue
    item.replace(zhRegex, (_, _prev, match) => {
      match = match.trim()
      return match
    })
  }
}

function readFileMap(path: string) {
  const list = readdirSync(path)
  for (const dir of list) {
    const filePath = join(path, dir)
    const state = statSync(filePath)
    if (state.isDirectory()) {
      readFileMap(filePath)
    } else {
      readFile(filePath)
    }
  }
}

function translate(code: string) {}

async function main() {
  readFileMap(join(__dirname, '../src'))
  console.log('>>>>>> main: ')
}

main()
