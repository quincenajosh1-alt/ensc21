import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      {
        name: 'github-pages-root-entry-bridge',
        transformIndexHtml: {
          order: 'pre',
          handler(html: string): string {
            return html.replace(
              /<!-- STATIC_GH_PAGES_ENTRY_START -->[\s\S]*?<!-- STATIC_GH_PAGES_ENTRY_END -->/,
              '<script type="module" src="/src/main.tsx"></script>',
            );
          },
        },
      },
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ and updates ./bundle/ for GitHub Pages main/(root) serving.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }

          const builtAssetsDir = path.resolve(distDir, 'assets');
          const bundleDir = path.resolve(rootDir, 'bundle');
          if (fs.existsSync(builtAssetsDir)) {
            fs.mkdirSync(bundleDir, {recursive: true});
            const files = fs.readdirSync(builtAssetsDir);
            const jsFile = files.find((f) => f.startsWith('index-') && f.endsWith('.js'));
            const cssFile = files.find((f) => f.startsWith('index-') && f.endsWith('.css'));
            if (jsFile) {
              fs.copyFileSync(
                path.resolve(builtAssetsDir, jsFile),
                path.resolve(bundleDir, 'index.js'),
              );
            }
            if (cssFile) {
              fs.copyFileSync(
                path.resolve(builtAssetsDir, cssFile),
                path.resolve(bundleDir, 'index.css'),
              );
            }
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
