// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

	css: [
		'@/assets/css/normalize.scss',
		'@/assets/css/common.scss',
		'@/assets/css/forms.scss',
		'@/assets/css/general.scss'
	],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en_US.json', name: 'English' },
      { code: 'de', language: 'de-DE', file: 'de_DE.json', name: 'Deutsch' },
      { code: 'es', language: 'es-ES', file: 'es_ES.json', name: 'Español' },
      { code: 'hu', language: 'hu-HU', file: 'hu_HU.json', name: 'Magyar' },
      { code: 'nl', language: 'nl-NL', file: 'nl_NL.json', name: 'Nederlands' },
      { code: 'pl', language: 'pl-PL', file: 'pl_PL.json', name: 'Polski' },
      { code: 'pt', language: 'pt-BR', file: 'pt_BR.json', name: 'Português' },
      { code: 'tr', language: 'tr-TR', file: 'tr_TR.json', name: 'Türkçe' },
      { code: 'zh', language: 'zh-CN', file: 'zh_CN.json', name: '中文' }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    compilation: {
      strictMessage: false
    }
  },


  // Auto imports
  components: true,

  // Runtime configuration for environment variables
  runtimeConfig: {
    // Monero node configuration
    moneroNodes: 'http://opennode.xmr-tw.org:18089,http://node.supportxmr.com:18081,http://nodes.hashvault.pro:18081',
    moneroNodeTimeout: 10000
  },

  // App configuration
  app: {
    head: {
      title: 'Explore Monero',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Monero blockchain explorer - Verify transactions in the Monero payment network' },
        { name: "twitter:card", content: "product" },
        { name: "twitter:site", content: "@gbks" },
        { name: "twitter:title", content:  "Explore Monero" },
        { name: "twitter:description", content: "Monero blockchain explorer - Verify transactions in the Monero payment network" },
        { name: "twitter:image", content: "https://www.exploremonero.com/preview.jpg" },
        
        { property: "og:title", content: "Explore Monero" },
        { property: "og:description", content:  "Monero blockchain explorer - Verify transactions in the Monero payment network" },
        { property: "og:type", content: "product" },
        { property: "og:image", content: "https://www.exploremonero.com/preview.jpg" },
        { property: "og:url", content: "https://www.exploremonero.com" },

        { name: "robots", content: "index,follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" },
        { name: "google", content: "notranslate" },
        { name: "HandheldFriendly", content: "true" },
        
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black" }
      ],
      link: [
        { rel: "canonical", href: "https://www.exploremonero.com" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "https://www.exploremonero.com/monero-logo-32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "https://www.exploremonero.com/monero-logo-16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "https://www.exploremonero.com/monero-logo.png" }
      ]
    }
  }
})