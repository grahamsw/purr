/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*?url' {
  const content: string
  export default content
}
