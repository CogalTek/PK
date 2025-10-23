import { useTheme } from 'vuetify'

export function useThemeMode() {
	const theme = useTheme()
	const cookie = useCookie<'light' | 'dark'>('theme', {
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
	})

	const name = computed({
		get: () => theme.global.name.value as 'light' | 'dark',
		set: (val: 'light' | 'dark') => {
			theme.global.name.value = val
			cookie.value = val
		},
	})

	const isDark = computed({
		get: () => name.value === 'dark',
		set: (val: boolean) => {
			name.value = val ? 'dark' : 'light'
		},
	})

	function toggle() {
		isDark.value = !isDark.value
	}

	return { name, isDark, toggle }
}
