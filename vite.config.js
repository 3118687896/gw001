import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/gw001/', // GitHub Pages 仓库名称
    server: {
        port: 3000,
        open: true
    }
})