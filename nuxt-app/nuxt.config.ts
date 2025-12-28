// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },

	nitro: {
		preset: 'node-server',
		imports: {
			dirs: ['server/utils']
		}
	},

	modules: ['@nuxtjs/kinde', '@nuxt/icon'],

	vite: {
		plugins: [vuetify({ autoImport: true })],
	},

	css: ['vuetify/styles'],
	build: {
		transpile: ['vuetify'],
	},
})