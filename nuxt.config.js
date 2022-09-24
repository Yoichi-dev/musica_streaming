export default {
  ssr: false,
  target: 'static',
  head: {
    title: '塔野ムジカ',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '塔野ムジカ専用コメントビューワー' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    script: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.6/dayjs.min.js'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  css: [
    '@/assets/css/main.css',
  ],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
  ],
  axios: {
    baseURL: '/',
  },
  server: {
    host: '0.0.0.0'
  },
  generate: {
    fallback: true
  },
  build: {},
}
