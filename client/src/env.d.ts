/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly GROQ_API_KEY: string
  readonly ELEVEN_LABS_API_KEY: string
  readonly OPENAI_API_KEY?: string
  readonly PERPLEXITY_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}