import { lingui } from '@lingui/vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig((env) => {
  const processEnv = loadEnv(env.mode, process.cwd())
  const __BUILD_TIME__ = JSON.stringify(Date.now())

  console.log('>>>>>> processEnv: ', processEnv)

  return {
    plugins: [
      react({
        babel: {
          plugins: ['@lingui/babel-plugin-lingui-macro']
        }
      }),
      lingui(),
      svgr()
    ],
    define: {
      __BUILD_TIME__
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') }
    },
    server: {
      port: 8888,
      host: true,
      proxy: {
        // [processEnv.VITE_API_BASE_URL]: {
        //   target: processEnv.VITE_API_TARGET_URL,
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(new RegExp(`^${processEnv.VITE_API_BASE_URL}`), '')
        // }
      }
    }
  }
})
