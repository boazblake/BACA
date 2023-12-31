import { defineConfig } from "vite"
import { flowPlugin, esbuildFlowPlugin } from "@bunchtogether/vite-plugin-flow"
import vsharp from 'vite-plugin-vsharp'
import viteImagemin from 'vite-plugin-imagemin'
import path from "path"
import { VitePWA } from 'vite-plugin-pwa'



const pwa = () =>
  VitePWA({
    registerType: 'autoUpdate',
    devOptions: {
      enabled: false,
    },
    strategies: "generateSW",
    // srcDir: 'app',
    filename: 'vite-sw.js',
    includeAssets: ['fonts/*.ttf', 'fonts/*.woff', 'images/*.png']
  })

const imageMin = () => viteImagemin({
  gifsicle: {
    optimizationLevel: 7,
    interlaced: false,
  },
  optipng: {
    optimizationLevel: 7,
  },
  mozjpeg: {
    quality: 20,
  },
  pngquant: {
    quality: [0.8, 0.9],
    speed: 4,
  },
  svgo: {
    plugins: [
      {
        name: 'removeViewBox',
      },
      {
        name: 'removeEmptyAttrs',
        active: false,
      },
    ],
  },
})

const sharper = () => vsharp({
  src: "./public/",
  dest: "docs/assets/",
  imageExt: ["jpg", "png", "svg", "HEIC"],
  tasks: [
    [
      { resize: [1200] }, //width, height
      { ignoreAspectRatio: true },
      { toFormat: "webp" },
      { withoutEnlargement: true },
      { quality: 100 },
      { withoutAdaptiveFiltering: true },
      { optimiseScans: true },
      // { rename: "{base}-1200.{ext}" },
    ],
  ],
})

export default defineConfig({
  optimizeDeps: { esbuildOptions: { plugins: [esbuildFlowPlugin()] } },
  plugins: [flowPlugin(),
  // sharper(),
  imageMin(), pwa()],
  resolve: {
    alias: {
      stream: "mithril-stream",
      m: "mithril",
      "@": path.resolve(__dirname, "./app"),
      // "assets": path.resolve(__dirname, "./assets"),
      // "Models": path.resolve(__dirname, "./app/Models"),
      // "Utils": path.resolve(__dirname, "./app/Utils"),
      // "Layouts": path.resolve(__dirname, "./app/Layouts"),
      // "Pages": path.resolve(__dirname, "./app/Pages"),
    },
  },
  build: {
    outDir: "docs",
    rollupOptions: {
      manualChunks: {
        '@toast-ui/editor': ['@toast-ui/editor'],
      }
    }
  },
  server: {
    port: 3001,
    open: true,
  },
  base: './'
})

