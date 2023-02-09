import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import loadCssModulePlugin from 'vite-plugin-load-css-module';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    target: 'es2015',
  },
  plugins: [
      react(),
    loadCssModulePlugin({
      include: id => id.endsWith('scss') && !id.includes('node_modules'),
    })
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
    modules: {
      // 样式小驼峰转化,
      //css: goods-list => tsx: goodsList
      localsConvention: 'camelCase',
    },
  },
});
