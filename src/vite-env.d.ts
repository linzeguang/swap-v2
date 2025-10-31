/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: 'dev' | 'staging' | 'prod'
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TARGET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __BUILD_TIME__: string

declare interface Window {}
