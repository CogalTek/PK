<template>
  <v-dialog v-model="isOpen" max-width="600">
    <v-card>
      <v-card-title>Create New Server</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select
            v-model="formData.gameId"
            :items="games"
            item-title="name"
            item-value="id"
            label="Select Game"
            required
          ></v-select>
          
          <v-text-field 
            v-model="formData.name" 
            label="Server Name" 
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="submit">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>()

const props = defineProps<{
  games: any[]
}>()

const emit = defineEmits<{
  'submit': [data: { gameId: string, name: string }]
}>()

const formData = ref({
  gameId: '',
  name: '',
})

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    gameId: '',
    name: '',
  }
}

const submit = () => {
  emit('submit', {
    gameId: formData.value.gameId,
    name: formData.value.name,
  })
  close()
}

// Méthode publique pour pré-remplir le formulaire
const prefillForm = (gameId: string, name: string) => {
  formData.value.gameId = gameId
  formData.value.name = name
}

defineExpose({ prefillForm })
</script>
