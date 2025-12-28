<template>
    <v-card class="cron-card pa-4 mb-2" style="width: 100%;">
        <div class="cron-row">
            <div class="cron-info">
                <div class="cron-header">
                    <Icon name="material-symbols:alarm" size="20" class="mr-2" style="color: #4CAF50;" />
                    <div class="font-weight-bold text-h6">{{ cron.name || 'Sans nom' }}</div>
                </div>
                
                <div class="mt-2 text-body-2">
                    <strong>Description:</strong> {{ cron.description || 'Aucune description' }}
                </div>
                
                <div class="mt-2 device-info">
                    <Icon name="material-symbols-light:devices-outline" size="18" class="mr-1" />
                    <span class="text-body-2">
                        <strong>Device:</strong> {{ cron.device?.name || 'Inconnu' }} 
                        <span class="text-grey text-caption">({{ cron.device?.macAddress || 'N/A' }})</span>
                    </span>
                </div>

                <div class="mt-2 schedule-info">
                    <Icon name="material-symbols:schedule" size="18" class="mr-1" />
                    <span class="text-body-2">
                        <strong>Horaires:</strong> {{ scheduleText }}
                    </span>
                </div>
                
                <div class="text-caption text-grey mt-2">
                    Créé le {{ formattedDate }}
                </div>
            </div>
            <div class="cron-actions">
                <v-btn
                    icon
                    color="success"
                    @click="start()"
                    style="margin-right: 1vw;"
                    title="Démarrer maintenant"
                >
                    <Icon name="material-symbols-light:play-arrow-rounded" size="28" />
                </v-btn>
                <v-btn
                    icon
                    color="error"
                    @click="$emit('delete', cron)"
                    title="Supprimer"
                >
                    <Icon name="material-symbols:delete-outline" size="24" />
                </v-btn>
            </div>
        </div>
    </v-card>
</template>

<script setup>
const props = defineProps({
    cron: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['delete', 'start-success', 'start-error'])

const formattedDate = computed(() => {
    return new Date(props.cron.createdAt).toLocaleDateString('fr-FR')
})

const scheduleText = computed(() => {
    if (!props.cron.calendar?.dateTimes || props.cron.calendar.dateTimes.length === 0) {
        return 'Aucun horaire défini'
    }

    const dateTimes = props.cron.calendar.dateTimes
    const firstTime = dateTimes[0].hours

    // Si 7 jours configurés avec la même heure = récurrence quotidienne
    if (dateTimes.length === 7) {
        const allSameHour = dateTimes.every(dt => dt.hours === firstTime)
        if (allSameHour) {
            return `Tous les jours à ${firstTime}`
        }
    }

    // Sinon, afficher tous les jours/heures
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const schedules = dateTimes.map(dt => `${dayNames[dt.day]} ${dt.hours}`)
    
    if (schedules.length === 1) {
        return schedules[0]
    }
    
    return schedules.join(', ')
})

const start = async () => {
    try {
        // Appeler l'API pour démarrer le device immédiatement
        await $fetch(`/api/devices/${props.cron.deviceId}/start`, {
            method: 'POST'
        })
        console.log('✅ Démarrage du device:', props.cron.device?.name)
        emit('start-success', props.cron.device?.name || 'Device')
    } catch (e) {
        console.error('❌ Erreur lors du démarrage:', e)
        emit('start-error')
    }
}
</script>

<style scoped>
.cron-card {
    width: 100%;
    box-sizing: border-box;
    border-left: 4px solid #4CAF50;
}
.cron-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.cron-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}
.cron-header {
    display: flex;
    align-items: center;
}
.device-info, .schedule-info {
    display: flex;
    align-items: center;
}
.cron-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
