<template>
  <v-card>
    <v-card-title>{{ server.name }}</v-card-title>
    <v-card-subtitle>{{ server.game?.name }}</v-card-subtitle>
    <v-card-text>
      <v-chip :color="statusColor" size="small" class="mb-2">
        {{ server.status }}
      </v-chip>
      <div v-if="server.dockerContainerId">
        <strong>Container:</strong> {{ server.dockerContainerId.substring(0, 12) }}
      </div>
      <div><strong>Type:</strong> {{ server.type }}</div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="server.status === 'STOPPED' || server.status === 'FAILED'"
        color="success"
        variant="text"
        @click="$emit('start', server.id)"
        :loading="loading"
        icon
      >
        <v-icon color="success">mdi-play</v-icon>
      </v-btn>
      <v-btn
        v-if="server.status === 'RUNNING'"
        color="warning"
        variant="text"
        @click="$emit('stop', server.id)"
        :loading="loading"
        icon
      >
        <v-icon color="warning">mdi-stop</v-icon>
      </v-btn>
      <v-btn
        color="info"
        variant="text"
        @click="$emit('show-logs', server.id)"
        icon
      >
        <v-icon color="info">mdi-text-box</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        variant="text"
        @click="$emit('delete', server.id)"
        icon
      >
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  server: any
  loading?: boolean
}>()

defineEmits<{
  'start': [id: string]
  'stop': [id: string]
  'show-logs': [id: string]
  'delete': [id: string]
}>()

const statusColor = computed(() => {
  switch (props.server.status) {
    case 'RUNNING':
      return 'success'
    case 'STOPPED':
      return 'grey'
    case 'STARTING':
    case 'STOPPING':
      return 'warning'
    case 'FAILED':
      return 'error'
    default:
      return 'info'
  }
})
</script>
