/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_DEBUG_MODE: string
  // más variables de entorno aquí...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


