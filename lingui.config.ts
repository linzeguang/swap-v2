import { defineConfig } from '@lingui/cli'

export default defineConfig({
  sourceLocale: 'zh',
  locales: ['en', 'zh'],
  compileNamespace: 'json',
  catalogs: [
    {
      path: '<rootDir>/public/locales/{locale}/messages',
      include: ['src']
    }
  ]
})
