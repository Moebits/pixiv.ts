import {build} from "esbuild"
import {NodeModulesPolyfillPlugin} from "@esbuild-plugins/node-modules-polyfill"
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill"

build({
  entryPoints: ["dist/pixiv.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: "browser",
  format: "esm",
  outfile: "dist/pixiv.browser.js",
  define: {
    "process.env.NODE_ENV": "'production'",
    "process.versions.node": "'23.7.0'"
  },
  plugins: [
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
    NodeModulesPolyfillPlugin()
  ],
  mainFields: ["browser", "module", "main"],
  external: ["node:fs/promises", "http2", "fs", "path", "crypto", "@aws-sdk/client-s3"],
})