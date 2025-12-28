<template>
    <v-dialog v-model="isOpen" max-width="500">
        <v-card>
            <v-card-title class="text-h5 d-flex align-center">
                <Icon name="material-symbols:warning" size="28" class="mr-2" style="color: #F44336;" />
                Confirmer la suppression
            </v-card-title>
            
            <v-card-text>
                <p class="mb-3">
                    Voulez-vous vraiment supprimer la tâche cron 
                    <strong>"{{ cron?.name || 'Sans nom' }}"</strong> ?
                </p>
                
                <v-alert 
                    v-if="cron?.device"
                    type="info" 
                    variant="tonal" 
                    density="compact"
                    class="mb-0"
                >
                    <div class="text-body-2">
                        <strong>Device associé:</strong> {{ cron.device.name }}
                    </div>
                    <div class="text-caption">
                        Cette action est irréversible.
                    </div>
                </v-alert>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="grey-darken-1"
                    variant="text"
                    @click="cancel"
                    :disabled="loading"
                >
                    Annuler
                </v-btn>
                <v-btn
                    color="error"
                    variant="elevated"
                    @click="confirm"
                    :loading="loading"
                >
                    <Icon name="material-symbols:delete-outline" size="20" class="mr-1" />
                    Supprimer
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    cron: {
        type: Object,
        default: null
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const cancel = () => {
    isOpen.value = false
}

const confirm = () => {
    emit('confirm')
}
</script>
