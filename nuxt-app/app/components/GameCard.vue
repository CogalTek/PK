<template>
  <v-card>
    <v-card-title>{{ game.name }}</v-card-title>
    <v-card-subtitle>{{ game.type }}</v-card-subtitle>
    <v-card-text>
      <div v-if="game.image"><strong>Image:</strong> {{ game.image }}</div>
      <div v-if="game.ports.length"><strong>Ports:</strong> {{ game.ports.join(', ') }}</div>
      <div><strong>Public:</strong> {{ game.public ? 'Yes' : 'No' }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="text" @click="$emit('create-server', game)">
        <v-icon class="mr-2">mdi-server-plus</v-icon>
        Create Server
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="error" variant="text" @click="$emit('delete', game.id)" icon>
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  game: any
}>()

defineEmits<{
  'create-server': [game: any]
  'delete': [id: string]
}>()
</script>
