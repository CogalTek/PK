<template>
    <v-card class="cron-card pa-4 mb-2" style="width: 100%;">
        <div class="cron-row">
            <div class="cron-info">
                <div class="font-weight-bold">{{ cron.name || 'Sans nom' }}</div>
                <div class="mt-1"><strong>Description:</strong> {{ cron.description || 'Aucune' }}</div>
                <div class="text-caption text-grey mt-2">Créé le {{ formattedDate }}</div>
            </div>
            <div class="cron-actions">
                <v-btn
                    icon
                    color="blue"
                    @click="start()"
                    style="margin-right: 1vw;"
                >
                    <Icon name="material-symbols-light:play-arrow-rounded" size="24" />
                </v-btn>
                <v-btn
                    icon
                    color="error"
                    @click="$emit('delete', cron)"
                    style="margin-right: 1vw;"
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

defineEmits(['delete'])

const formattedDate = computed(() => {
    return new Date(props.cron.createdAt).toLocaleDateString('fr-FR')
})

const start = async () => {
    try {
        // Remplacer par l'appel API pour démarrer la tâche cron
        // await $fetch(`/api/cron/${props.cron.id}/start`)
    } catch (e) {
        console.error(e)
    }
}
</script>

<style scoped>
.cron-card {
    width: 100%;
    box-sizing: border-box;
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
}
.cron-actions {
    display: flex;
    align-items: center;
}
</style>
