<template>
  <v-app-bar color="surface" elevation="1" height="64">
    <v-container fluid class="d-flex align-center px-4">
      <!-- Logo/Title -->
      <h1 id="title" class="text-h5 font-weight-bold mr-8" @click="navigate('/home')">PK</h1>

      <!-- Navigation Buttons -->
      <v-btn variant="text" class="mx-1" @click="navigate('/cantine')">
        Cantine
      </v-btn>
      
      <v-btn variant="text" class="mx-1" @click="navigate('/banque')" >
        Banque
      </v-btn>
      
      <v-btn variant="text" class="mx-1" @click="navigate('/calendrier')">
        Calendrier
      </v-btn>

      <v-spacer />

      <!-- Theme Toggle Button -->
      <v-btn
        :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="toggleTheme"
        variant="text"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
    import { useTheme } from 'vuetify'

    const theme = useTheme()
    const { $toggleTheme } = useNuxtApp()

    const toggleTheme = () => {
        $toggleTheme()
    }

    const navigate = (where: string) => {
        const router = useRouter()
        router.push(where)
    }
</script>

<style scoped>
    .v-app-bar {
        border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }

    #title {
        cursor: pointer;
    }
</style>