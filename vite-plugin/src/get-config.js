import { version } from 'quasar/package.json'
import { normalizePath } from 'vite'

export default ({ runMode, sassVariables }, externalViteCfg) => {
  const viteCfg = {
    define: {
      __QUASAR_VERSION__: `'${ version }'`,
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false
    }
  }

  // Set this to the default value only if it's not already set.
  // @quasar/app-vite configures this by itself when it needs it.
  if (!externalViteCfg.define || externalViteCfg.define.__QUASAR_SSR_PWA__ === void 0) {
    viteCfg.define.__QUASAR_SSR_PWA__ = false
  }

  if (runMode === 'ssr-server') {
    Object.assign(viteCfg.define, {
      __QUASAR_SSR__: true,
      __QUASAR_SSR_SERVER__: true
    })
  }
  else {
    viteCfg.optimizeDeps = {
      exclude: [ 'quasar' ]
    }

    if (runMode === 'ssr-client') {
      Object.assign(viteCfg.define, {
        __QUASAR_SSR__: true,
        __QUASAR_SSR_CLIENT__: true
      })
    }
  }

  if (sassVariables) {
    const sassImportCode = [ `@import 'quasar/src/css/variables.sass'`, '' ]

    if (typeof sassVariables === 'string') {
      sassImportCode.unshift(`@import '${ normalizePath(sassVariables) }'`)
    }

    viteCfg.css = {
      preprocessorOptions: {
        sass: { additionalData: sassImportCode.join('\n') },
        scss: { additionalData: sassImportCode.join(';\n') }
      }
    }
  }

  return viteCfg
}
