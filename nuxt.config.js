require('dotenv').config()

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en-US'
    },
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          process.env.npm_package_description ||
          'Create and share your own Instagram video playlists. Play them in your presentations in fullscreen.'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://graphql.fauna.com' },
      { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['assets/css/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vue-touch.client'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    'nuxt-vue-select'
  ],
  toast: {
    position: 'top-center'
  },
  apollo: {
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network'
      }
    },
    // watchLoading: '~/plugins/apollo-watch-loading-handler.js',
    clientConfigs: {
      default: '~/plugins/apollo-config.js'
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.vue$/,
        loader: 'vue-svg-inline-loader',
        options: {
          /* ... */
        }
      })
    }
  },
  env: {
    faunaSecret: process.env.FAUNADB_SECRET,
    emailJsUserId: process.env.EMAILJS_USER_ID
  }
}
