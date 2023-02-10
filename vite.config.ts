import react from '@vitejs/plugin-react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { defineConfig } from 'vite';
import electron from 'vite-electron-plugin';
import { customStart, loadViteEnv } from 'vite-electron-plugin/plugin';
import renderer from 'vite-plugin-electron-renderer';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  fs.rmSync('dist-electron', { recursive: true, force: true });

  const sourcemap = command === 'serve' || !!process.env.SOURCEMAP;

  return {
    plugins: [
      react(),
      electron({
        include: ['electron'],
        transformOptions: {
          sourcemap,
        },
        plugins: [
          ...(!!process.env.VSCODE_DEBUG
            ? [
                // Will start Electron via VSCode Debug
                customStart(
                  debounce(() => console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'))
                ),
              ]
            : []),
          // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
          loadViteEnv(),
        ],
      }),
      // Use Node.js API in the Renderer-process
      renderer({
        nodeIntegration: true,
      }),
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
    clearScreen: false,
  };
});

const debounce = <Fn extends (...args: any[]) => void>(fn: Fn, delay = 299): Fn => {
  let t: NodeJS.Timeout;
  return ((...args: Parameters<Fn>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  }) as Fn;
};
