<template>
  <v-dialog v-model="isOpen" max-width="800">
    <v-card>
      <v-card-title>Server Logs</v-card-title>
      <v-card-text>
        <pre style="max-height: 400px; overflow-y: auto; background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 4px;">{{ logs }}</pre>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="isOpen = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>()

defineProps<{
  logs: string
}>()
</script>
