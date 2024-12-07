import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  define: {
    'process.env': process.env
  },
  server: {
    port: Number(process.env.VITE_PORT) || 3000
  },
  preview: {
    port: 8080
  }
})
