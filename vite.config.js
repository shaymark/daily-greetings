import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    headers: {
        'Content-Security-Policy':
        "script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; connect-src *; img-src * data:; default-src *;"
    }
  }
})
