<template>
    <v-container fluid class="mb-4">
        <v-row>
            <v-col cols="12">
                <v-card elevation="4" class="pa-4" style="background-color: #2a2a2a; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div class="d-flex align-center" style="gap: 12px;">
                        <v-text-field
                            v-model="task"
                            placeholder="Ajouter une nouvelle tâche..."
                            variant="outlined"
                            hide-details
                            class="flex-grow-1"
                            @keydown.enter="addTask"
                            style="background-color: #3a3a3a; color: white;"
                        >
                            <template v-slot:prepend-inner>
                                <Icon name="mdi:plus-circle-outline" size="24" style="color: rgba(255, 255, 255, 0.5);" />
                            </template>
                        </v-text-field>

                        <v-btn
                            variant="elevated"
                            @click="addTask"
                            :disabled="!task.trim()"
                            style="background-color: #ef4444; color: white; height: 56px; padding: 0 24px;"
                        >
                            <Icon name="mdi:plus" size="20" class="mr-1" />
                            Ajouter
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { ref } from 'vue'

    // 1. Déclaration de l'événement 'update'
    const emit = defineEmits(['update']) 

    const task = ref('')
    const auth = useState('auth', () => ({}))

    async function addTask() {
        if (!task.value.trim()) return

        console.log(auth.value.user.id)

        try {
            await $fetch("/api/todo", {
                method: "POST",
                body: {
                    kindeId: auth.value.user.id, 
                    name: task.value
                }
            })
            
            // 2. Émission de l'événement 'update' après succès
            emit('update') 
            
        } catch (e) {
            console.error(e)
        }

        task.value = ''
    }
</script>
