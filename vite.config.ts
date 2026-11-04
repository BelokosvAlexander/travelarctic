import path from 'path'
import { readFile, writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import react from '@vitejs/plugin-react'
import { createServer, defineConfig, type Plugin } from 'vite'
import { inspectAttr } from 'kimi-plugin-inspect-react'

function prerenderGuide(): Plugin {
  return {
    name: 'prerender-guide',
    apply: 'build',
    async writeBundle() {
      const server = await createServer({
        root: __dirname,
        appType: 'custom',
        logLevel: 'error',
        server: { middlewareMode: true },
      })

      try {
        const { default: App } = await server.ssrLoadModule('/src/App.tsx')
        const markup = renderToString(createElement(App))
        const indexPath = path.resolve(__dirname, 'dist/index.html')
        const html = await readFile(indexPath, 'utf8')
        const rootPattern = /<div id="root"><\/div>/

        if (!rootPattern.test(html)) {
          throw new Error('Не найден пустой корень для предварительного рендеринга')
        }

        await writeFile(indexPath, html.replace(rootPattern, `<div id="root">${markup}</div>`))
        console.log('Путеводитель предварительно отрисован в HTML')
      } finally {
        await server.close()
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), prerenderGuide()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
