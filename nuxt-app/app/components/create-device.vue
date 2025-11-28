<template>
    <v-dialog v-model="isOpen" max-width="600">
        <v-card>
            <v-card-title class="text-h5">
                Créer un nouveau device
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="newDevice.name" label="Nom du device"
                        :rules="[v => !!v || 'Le nom est requis']" required></v-text-field>

                    <v-text-field v-model="newDevice.macAddress" label="Adresse MAC" :rules="[
                        v => !!v || 'L\'adresse MAC est requise',
                        v => /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(v) || 'Format invalide (ex: AA:BB:CC:DD:EE:FF)'
                    ]" required></v-text-field>

                    <v-text-field v-model="newDevice.ipAddress" label="Adresse IP (optionnel)"></v-text-field>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="closeDialog">
                    Annuler
                </v-btn>
                <v-btn color="primary" variant="text" @click="createDevice">
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

    const emit = defineEmits(['update:modelValue', 'device-created'])

    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    const form = ref(null)
    const newDevice = ref({
        name: '',
        macAddress: '',
        ipAddress: ''
    })

    const closeDialog = () => {
        isOpen.value = false
        newDevice.value = {
            name: '',
            macAddress: '',
            ipAddress: ''
        }
    }

    const createDevice = async () => {
        const { valid } = await form.value.validate()

        if (valid) {
            // Logique pour créer le device (API call, etc.)
            console.log('Nouveau device:', newDevice.value)

            const auth = useState('auth', () => ({}))

            const res = await $fetch("/api/devices", {
                method: "POST",
                body: {
                    device: newDevice.value,
                    user: auth.value.user.id
                }
            })

            // ajouter une alert si success

            emit('device-created', newDevice.value)
            closeDialog()
        }
    }
</script>
