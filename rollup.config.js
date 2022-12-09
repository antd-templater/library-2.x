import { defineConfig } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import alias from '@rollup/plugin-alias'
import vue from 'rollup-plugin-vue'

/**
 * Rollup Configuration
 */
export default defineConfig([
  {
    input: [
      'src/lib/S-Table/index.js',
      'src/lib/S-Table/filter.js',
      'src/lib/S-EditCell/Input.vue',
      'src/lib/S-EditCell/Select.vue',
      'src/lib/S-EditCell/Textarea.vue',
      'src/lib/S-EditCell/DatePicker.vue',
      'src/lib/S-EditCell/TreeSelect.vue',
      'src/lib/S-IconSelect/index.vue',
      'src/lib/S-Ellipsis/index.vue',
      'src/lib/S-Form/initial.js',
      'src/lib/S-Form/helper.js',
      'src/lib/S-Form/index.vue',
      'src/lib/S-Tree/index.vue',
      'src/util/helper.js',
      'src/util/base.js',
      'src/index.js'
    ],
    output: [
      {
        dir: 'dist',
        format: 'es',
        hoistTransitiveImports: false,
        entryFileNames: chunk => {
          const id = chunk.facadeModuleId
          const dir = id.replace(/.+\/src\/(([^/]+)\/)?(([^./]+)\/)?[^./]+(\.js|\.vue)/, '$2')
          const type = id.replace(/.+\/src\/(([^/]+)\/)?(([^./]+)\/)?[^./]+(\.js|\.vue)/, '$4')
          return dir && type ? `${dir}/${type}/[name].mjs` : dir ? `${dir}/[name].mjs` : `[name].mjs`
        },
        chunkFileNames: `vendor/[name]-[hash].mjs`
      },
      {
        dir: 'dist',
        format: 'cjs',
        exports: 'named',
        hoistTransitiveImports: false,
        entryFileNames: chunk => {
          const id = chunk.facadeModuleId
          const dir = id.replace(/.+\/src\/(([^/]+)\/)?(([^./]+)\/)?[^./]+(\.js|\.vue)/, '$2')
          const type = id.replace(/.+\/src\/(([^/]+)\/)?(([^./]+)\/)?[^./]+(\.js|\.vue)/, '$4')
          return dir && type ? `${dir}/${type}/[name].cjs` : dir ? `${dir}/[name].cjs` : `[name].cjs`
        },
        chunkFileNames: `vendor/[name]-[hash].cjs`
      }
    ],
    plugins: [
      alias({
        entries: [{
          find: '@',
          replacement: new URL('./src', import.meta.url).pathname
        }]
      }),
      vue(),
      postcss(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.vue'],
        exclude: /\/src\/util\/.+/
      }),
      nodeResolve(),
      commonjs()
    ],
    external: [
      /^vue(\/.+|$)/,
      /^moment(\/.+|$)/,
      /^ant-design-vue(\/.+|$)/
    ]
  }
])
