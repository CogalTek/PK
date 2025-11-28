<template>
    <v-dialog v-model="isOpen" max-width="600">
        <v-card>
            <v-card-title class="text-h5">
                Créer une nouvelle tâche cron
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="newCron.name" label="Nom de la tâche"
                        :rules="[v => !!v || 'Le nom est requis']" required></v-text-field>

                    <v-textarea v-model="newCron.description" label="Description" rows="2"></v-textarea>

                    <v-text-field v-model="newCron.hour" type="time" label="Heure d'execution" required></v-text-field>

                    <v-row class="mb-2">
                        <v-col cols="12">
                            <v-checkbox
                                v-model="newCron.recurrence"
                                label="Récurrence (tous les jours à cette heure)"
                                hide-details="auto"
                                color="primary"
                                class="text-white"
                                :style="'background-color: #222; border-radius: 8px; padding: 8px;'"
                            />
                        </v-col>
                    </v-row>

                    <v-text-field
                        v-if="!newCron.recurrence"
                        v-model="newCron.date"
                        type="date"
                        label="Date d'exécution"
                        required
                    />

                    <v-select
                        v-model="newCron.deviceId"
                        :items="devices"
                        item-title="name"
                        item-value="id"
                        label="Device associé"
                        :rules="[v => !!v || 'Sélectionnez un device']"
                        required
                    />
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
                    Annuler
                </v-btn>
                <v-btn color="primary" variant="text" @click="createCron">
                    Créer
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
    }
})

const emit = defineEmits(['update:modelValue', 'cron-created'])

const isOpen = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const form = ref(null)
const newCron = ref({
    name: '',
    description: '',
    hour: null,
    deviceId: null,
    recurrence: false,
    date: null
})

const devices = ref([])
const auth = useState('auth', () => ({}))

onMounted(async () => {
    if (auth.value.user?.id) {
        const { data } = await useFetch('/api/devices', {
            query: { userId: auth.value.user.id }
        })
        console.log('Fetched devices:', data.value)
        devices.value = data.value?.devices || []
    }
})

const closeDialog = () => {
    isOpen.value = false
    newCron.value = {
        name: '',
        description: '',
        hour: null,
        deviceId: null,
        recurrence: false,
        date: null
    }
}

const createCron = async () => {
    const { valid } = await form.value.validate()

    if (valid) {
        // Logique pour créer la tâche cron (API call, etc.)
        const auth = useState('auth', () => ({}))
        const payload = {
            name: newCron.value.name,
            description: newCron.value.description,
            hour: newCron.value.hour,
            deviceId: newCron.value.deviceId,
            userId: auth.value.user.id,
            recurrence: newCron.value.recurrence,
            date: newCron.value.recurrence ? null : newCron.value.date
        }
        let createdCron = null
        try {
            const res = await $fetch("/api/cron", {
                method: "POST",
                body: payload
            })
            createdCron = res.cron || {
                ...payload,
                createdAt: new Date().toISOString(),
                id: Date.now().toString()
            }
        } catch (e) {
            // fallback local si erreur API
            createdCron = {
                ...payload,
                createdAt: new Date().toISOString(),
                id: Date.now().toString()
            }
        }
        emit('cron-created', createdCron)
        closeDialog()
    }
}
</script>
