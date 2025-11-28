<template>
            <!-- Dialog de confirmation suppression device -->
            <DeleteDeviceDialog
                v-model="deleteDialog"
                :device="deviceToDelete"
                :loading="deleting"
                @confirm="deleteDevice"
            />
    <Header />
    <div>
        <!-- Barre Devices -->
        <v-toolbar color="surface" dark :elevation="2" class="rounded mb-4 px-4" style="background-color: #232323;">
            <Icon name="material-symbols-light:devices-outline" style="color: white;" size="36" class="mr-2" />
            <span class="font-weight-bold mr-4">Devices</span>
            <v-spacer />
            <v-btn icon @click="dialog = true">
                <Icon name="material-symbols:add" style="color: white;" size="24" />
            </v-btn>
        </v-toolbar>

        <!-- Dialog création device -->
        <CreateDevice v-model="dialog" @device-created="onDeviceCreated" />

        <!-- Cartes Devices -->
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <v-progress-circular v-if="pending" indeterminate color="primary" class="my-4" />

                    <v-list v-else>
                        <template v-if="devices && devices.length > 0">
                            <device-card v-for="device in devices" :key="device.id" :device="device"
                                @delete="confirmDelete" class="mb-2" />
                        </template>

                        <template v-else>
                            <v-list-item>
                                <v-list-item-title class="text-grey">Aucun device enregistré</v-list-item-title>
                                <v-list-item-subtitle class="text-grey">
                                    Cliquez sur le bouton + pour ajouter un device
                                </v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </v-list>
                </v-col>
            </v-row>
        </v-container>

        <!-- Barre Cron -->
        <v-toolbar color="surface" dark :elevation="2" class="rounded mb-4 mt-6 px-4"
            style="background-color: #232323;">
            <Icon name="material-symbols:alarm" style="color: white;" size="28" class="mr-2" />
            <span class="font-weight-bold mr-4">Cron</span>
            <v-spacer />
            <v-btn icon @click="dialogCron = true">
                <Icon name="material-symbols:add" style="color: white;" size="24" />
            </v-btn>
        </v-toolbar>

            <!-- Dialog de confirmation suppression cron -->
            <delete-cron-dialog
                v-model="deleteDialogCron"
                :cron="cronToDelete"
                :loading="deletingCron"
                @confirm="deleteCron"
            />

            <!-- Dialog création cron -->
            <create-cron v-model="dialogCron" @cron-created="onCronCreated" />

            <!-- Cartes Cron -->
            <v-container fluid>
                <v-row>
                    <v-col cols="12">
                        <v-list>
                            <template v-if="Array.isArray(crons) ? crons.length > 0 : crons && crons.value && crons.value.length > 0">
                                <cron-card
                                    v-for="cron in (Array.isArray(crons) ? crons : crons.value)"
                                    :key="cron.id"
                                    :cron="cron"
                                    @delete="confirmDeleteCron"
                                    class="mb-2"
                                />
                            </template>
                            <template v-else>
                                <v-list-item>
                                    <v-list-item-title class="text-grey">Aucune tâche cron enregistrée</v-list-item-title>
                                    <v-list-item-subtitle class="text-grey">
                                        Cliquez sur le bouton + pour ajouter une tâche cron
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </template>
                        </v-list>
                    </v-col>
                </v-row>
            </v-container>
    </div>
</template>
<script setup>
import Header from '../components/header.vue'
import CreateDevice from '../components/create-device.vue'
import DeviceCard from '../components/device-card.vue'
import DeleteDeviceDialog from '../components/delete-device-dialog.vue'

definePageMeta({
    middleware: ['auth-logged-in'],
})

const auth = useState('auth', () => ({}))
const dialog = ref(false)
const deleteDialog = ref(false)
const deviceToDelete = ref(null)
const deleting = ref(false)

const dialogCron = ref(false)
const deleteDialogCron = ref(false)
const deviceToDeleteCron = ref(null)
const deletingCron = ref(false)

// Récupérer les devices
const { data: devicesData, pending, refresh } = await useFetch('/api/devices', {
    query: {
        userId: auth.value.user.id
    }
})



const crons = ref([])
const loadingCrons = ref(false)

const fetchCrons = async () => {
    loadingCrons.value = true
    try {
        console.log('Fetching crons for user:', auth.value.user.id)
        const res = await $fetch(`/api/cron/${auth.value.user.id}/`, {
            method: 'GET'
        })
        crons.value = res?.crons ?? []
    } catch (e) {
        console.error('Erreur fetch crons:', e)
        crons.value = []
    } finally {
        loadingCrons.value = false
    }
}

onMounted(async () => {
    await fetchCrons()
})


const devices = computed(() => devicesData.value?.devices || [])


const onDeviceCreated = async (device) => {
    console.log('Device créé:', device)
    // Rafraîchir la liste des devices
    await refresh()
}


const onCronCreated = async (cron) => {
    console.log('Cron créée:', cron)
    await fetchCrons()
}


const confirmDelete = (device) => {
    deviceToDelete.value = device
    deleteDialog.value = true
}

const confirmDeleteCron = (cron) => {
    cronToDelete.value = cron
    deleteDialogCron.value = true
}


const deleteDevice = async () => {
    if (!deviceToDelete.value) return

    deleting.value = true
    try {
        await $fetch(`/api/devices/${deviceToDelete.value.id}`, {
            method: 'DELETE'
        })

        // Rafraîchir la liste
        await refresh()
        deleteDialog.value = false
        deviceToDelete.value = null
    } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        // TODO: Afficher un message d'erreur
    } finally {
        deleting.value = false
    }
}


const deleteCron = async () => {
    if (!cronToDelete.value) return

    deletingCron.value = true
    try {
        await $fetch(`/api/cron/${cronToDelete.value.id}`, {
            method: 'DELETE'
        })
        await fetchCrons()
        deleteDialogCron.value = false
        cronToDelete.value = null
    } catch (error) {
        console.error('Erreur lors de la suppression du cron:', error)
        // TODO: Afficher un message d'erreur
    } finally {
        deletingCron.value = false
    }
}
</script>