<template>
    <v-dialog v-model="isOpen" max-width="400">
        <v-card>
            <v-card-title class="text-h5">
                Confirmer la suppression
            </v-card-title>
            
            <v-card-text>
                Voulez-vous vraiment supprimer le device "{{ device?.name || 'Sans nom' }}" ?
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="grey-darken-1"
                    variant="text"
                    @click="cancel"
                >
                    Annuler
                </v-btn>
                <v-btn
                    color="error"
                    variant="text"
                    @click="confirm"
                    :loading="loading"
                >
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
    device: {
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
