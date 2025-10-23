<!-- app.vue -->
<template>
	<v-app>
		<v-main>
			<NuxtPage />
		</v-main>
	</v-app>
</template>

<style>
	.page-enter-active,
	.page-leave-active {
		transition: opacity 0.5s ease;
	}
	.page-enter-from,
	.page-leave-to {
		opacity: 0;
	}
</style>
