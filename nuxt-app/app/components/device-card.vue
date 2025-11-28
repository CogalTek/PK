<template>
    <v-card class="device-card pa-4 mb-2" style="width: 100%;">
        <div class="device-row">
            <div class="device-info">
                <div class="font-weight-bold">{{ device.name || 'Sans nom' }}</div>
                <div class="mt-1"><strong>MAC:</strong> {{ device.macAddress }}</div>
                <div class="text-caption text-grey mt-2">Créé le {{ formattedDate }}</div>
            </div>
            <div class="device-actions">
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
                    @click="$emit('delete', device)"
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
    device: {
        type: Object,
        required: true
    }
})

defineEmits(['delete'])

const formattedDate = computed(() => {
    return new Date(props.device.createdAt).toLocaleDateString('fr-FR')
})

const start = async () => {
    try {
        const res = await $fetch(`/api/devices/${props.device.id}/start`)
    } catch (e) {
        console.error(e)
    }
}
</script>

<style scoped>
/* Largeur max et padding pour les cards */
.device-card {
    width: 100%;
    box-sizing: border-box;
}
.device-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.device-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.device-actions {
    display: flex;
    align-items: center;
}
</style>
