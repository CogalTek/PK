<template>
    <v-dialog v-model="isOpen" max-width="600">
        <v-card>
            <v-card-title class="text-h5 d-flex align-center">
                <Icon name="material-symbols:alarm" size="28" class="mr-2" style="color: #4CAF50;" />
                Créer une nouvelle tâche cron
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-text-field 
                        v-model="newCron.name" 
                        label="Nom de la tâche"
                        :rules="[v => !!v || 'Le nom est requis']" 
                        required
                        prepend-inner-icon="mdi-pencil"
                    />

                    <v-textarea 
                        v-model="newCron.description" 
                        label="Description" 
                        rows="2"
                        prepend-inner-icon="mdi-text"
                    />

                    <v-select
                        v-model="newCron.deviceId"
                        :items="devices"
                        item-title="name"
                        item-value="id"
                        label="Device à réveiller"
                        :rules="[v => !!v || 'Sélectionnez un device']"
                        required
                        prepend-inner-icon="mdi-devices"
                        :loading="loadingDevices"
                        :disabled="loadingDevices || devices.length === 0"
                        :hint="devices.length === 0 ? 'Aucun device disponible. Créez-en un d\'abord.' : ''"
                        persistent-hint
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                                <v-list-item-subtitle>{{ item.raw.macAddress }}</v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </v-select>

                    <v-divider class="my-4" />

                    <div class="text-subtitle-1 mb-2 font-weight-bold">
                        <Icon name="material-symbols:schedule" size="20" class="mr-1" />
                        Planification
                    </div>

                    <v-text-field 
                        v-model="newCron.hour" 
                        type="time" 
                        label="Heure d'exécution" 
                        required
                        prepend-inner-icon="mdi-clock-outline"
                        :rules="[v => !!v || 'L\'heure est requise']"
                    />

                    <v-row class="mb-2">
                        <v-col cols="12">
                            <v-checkbox
                                v-model="newCron.recurrence"
                                label="Répéter tous les jours à cette heure"
                                hide-details="auto"
                                color="primary"
                                class="text-white"
                                :style="'background-color: #2a2a2a; border-radius: 8px; padding: 8px;'"
                            >
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        <Icon name="mdi-repeat" size="18" class="mr-2" />
                                        <span>Répéter tous les jours à cette heure</span>
                                    </div>
                                </template>
                            </v-checkbox>
                        </v-col>
                    </v-row>

                    <v-text-field
                        v-if="!newCron.recurrence"
                        v-model="newCron.date"
                        type="date"
                        label="Date d'exécution (unique)"
                        required
                        prepend-inner-icon="mdi-calendar"
                        :rules="[v => !!v || 'La date est requise']"
                        hint="La tâche s'exécutera une seule fois à cette date"
                        persistent-hint
                    />
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
                    Annuler
                </v-btn>
                <v-btn color="primary" variant="elevated" @click="createCron">
                    <Icon name="mdi-check" size="20" class="mr-1" />
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
const loadingDevices = ref(false)
const auth = useState('auth', () => ({}))

const loadDevices = async () => {
    if (!auth.value.user?.id) return
    
    loadingDevices.value = true
    try {
        const { data } = await useFetch('/api/devices', {
            query: { userId: auth.value.user.id }
        })
        console.log('Fetched devices:', data.value)
        devices.value = data.value?.devices || []
        console.log('Devices loaded:', devices.value.length)
    } catch (error) {
        console.error('Error loading devices:', error)
        devices.value = []
    } finally {
        loadingDevices.value = false
    }
}

// Charger les devices au montage
onMounted(() => {
    loadDevices()
})

// Recharger les devices quand le dialog s'ouvre
watch(() => props.modelValue, (newValue) => {
    if (newValue) {
        loadDevices()
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
        const auth = useState('auth', () => ({}))
        
        // Calculer le jour de la semaine si non récurrent
        let dayOfWeek = null
        if (!newCron.value.recurrence && newCron.value.date) {
            const selectedDate = new Date(newCron.value.date)
            dayOfWeek = selectedDate.getDay() // 0 = Dimanche, 1 = Lundi, etc.
        }
        
        const payload = {
            name: newCron.value.name,
            description: newCron.value.description,
            hour: newCron.value.hour,
            deviceId: newCron.value.deviceId,
            userId: auth.value.user.id,
            recurrence: newCron.value.recurrence,
            day: dayOfWeek
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
            console.log('✅ Tâche cron créée avec succès:', createdCron)
        } catch (e) {
            console.error('❌ Erreur lors de la création du cron:', e)
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
