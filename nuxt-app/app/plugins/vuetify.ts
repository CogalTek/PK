import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
	// Cookie persistant pour le thème (light|dark)
	const themeCookie = useCookie<'light' | 'dark'>('theme', {
		// Permet au SSR de lire/écrire le cookie proprement
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	})

	// Détection du thème système côté client
	const systemPrefersDark =
		process.client && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

	// Choix du thème par défaut : cookie > système > light
	const defaultTheme = themeCookie.value ?? (systemPrefersDark ? 'dark' : 'light')

	const vuetify = createVuetify({
		components,
		directives,
		icons: {
			defaultSet: 'mdi', // Utiliser Material Design Icons
		},
		theme: {
			defaultTheme,
			themes: {
				light: {
					colors: {
						primary: '#1976D2',
						secondary: '#424242',
						accent: '#82B1FF',
						error: '#FF5252',
						info: '#2196F3',
						success: '#4CAF50',
						warning: '#FB8C00',
						background: '#FFFFFF',
						surface: '#FFFFFF',
					},
				},
				dark: {
					dark: true,
					colors: {
						primary: '#90CAF9',
						secondary: '#BDBDBD',
						accent: '#82B1FF',
						error: '#EF5350',
						info: '#64B5F6',
						success: '#81C784',
						warning: '#FFB74D',
						background: '#121212',
						surface: '#1E1E1E',
					},
				},
			},
		},
	})

	// Injecte Vuetify dans l'app
	nuxtApp.vueApp.use(vuetify)

	// Fournit un helper global pour basculer et persister
	nuxtApp.provide('toggleTheme', () => {
		const current = vuetify.theme.global.name.value
		const next = current === 'dark' ? 'light' : 'dark'
		vuetify.theme.global.name.value = next
		themeCookie.value = next
	})

	// Si aucun cookie, initialise-le (après le mount client)
	if (process.client && !themeCookie.value) {
		themeCookie.value = defaultTheme
	}
})
