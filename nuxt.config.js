require('dotenv').config()

export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'musica-comment',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '塔野ムジカ専用コメントビューワー' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    script: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.0/gsap.min.js'
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.10.6/dayjs.min.js'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap'
      }
    ]
  },
  css: [
    '@/assets/css/main.css',
  ],
  plugins: [
  ],
  components: true,
  buildModules: [
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
  ],
  axios: {},
  pwa: {
    manifest: {
      lang: 'ja'
    }
  },
  server: {
    host: '0.0.0.0'
  },
  generate: {
    fallback: true
  },
  env: {
    API_URL: process.env.API_URL
  },
  build: {
  }
}
