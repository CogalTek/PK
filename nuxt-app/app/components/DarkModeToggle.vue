<template>
	<v-btn
		variant="text"
		:icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
		@click="toggle"
		:aria-label="isDark ? 'Passer en clair' : 'Passer en sombre'"
	/>
</template>

<script setup lang="ts">
    import { useThemeMode } from '~/composables/useThemeMode'
    const { isDark, toggle } = useThemeMode()
</script>
