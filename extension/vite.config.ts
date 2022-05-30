import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from '@samrum/vite-plugin-web-extension'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: {
        manifest_version: 2,
        short_name: "Tenabl",
        name: 'Tenabl trust-network-based content validation',
        version: '0.1',
        description: 'Learn what the people you trust think about information on the web',
        permissions: [
          "storage"
        ],
        content_scripts: [
          {
            matches: ['<all_urls>'],
            js: ['./src/index.ts']
          }
        ]
      }
    })
  ]
})
