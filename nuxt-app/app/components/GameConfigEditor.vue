<template>
  <v-card class="mt-4" v-if="schema">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" color="blue-grey">mdi-cog</v-icon>
      Configuration avancée - {{ schema.name }}
    </v-card-title>
    <v-card-text>
      <!-- Group configuration by categories -->
      <v-expansion-panels multiple v-model="expandedPanels">
        <v-expansion-panel
          v-for="group in groupedFields"
          :key="group.name"
          :value="group.name"
        >
          <v-expansion-panel-title>
            <v-icon class="mr-2">{{ getGroupIcon(group.name) }}</v-icon>
            {{ group.name }}
            <v-chip size="small" class="ml-2">{{ group.fields.length }}</v-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col
                v-for="field in group.fields"
                :key="field.key"
                :cols="field.type === 'boolean' ? 12 : 12"
                :md="field.type === 'boolean' ? 6 : 6"
              >
                <!-- Text field -->
                <v-text-field
                  v-if="field.type === 'text'"
                  v-model="config[field.key]"
                  :label="field.label"
                  :hint="field.hint"
                  :required="field.required"
                  persistent-hint
                  density="comfortable"
                ></v-text-field>

                <!-- Number field -->
                <v-text-field
                  v-else-if="field.type === 'number'"
                  v-model.number="config[field.key]"
                  :label="field.label"
                  :hint="field.hint"
                  :required="field.required"
                  type="number"
                  persistent-hint
                  density="comfortable"
                ></v-text-field>

                <!-- Password field -->
                <v-text-field
                  v-else-if="field.type === 'password'"
                  v-model="config[field.key]"
                  :label="field.label"
                  :hint="field.hint"
                  :required="field.required"
                  :type="showPassword[field.key] ? 'text' : 'password'"
                  :append-inner-icon="showPassword[field.key] ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword[field.key] = !showPassword[field.key]"
                  persistent-hint
                  density="comfortable"
                ></v-text-field>

                <!-- Select field -->
                <v-select
                  v-else-if="field.type === 'select'"
                  v-model="config[field.key]"
                  :label="field.label"
                  :items="field.options"
                  :hint="field.hint"
                  :required="field.required"
                  persistent-hint
                  density="comfortable"
                ></v-select>

                <!-- Boolean field -->
                <v-switch
                  v-else-if="field.type === 'boolean'"
                  v-model="config[field.key]"
                  :label="field.label"
                  :hint="field.hint"
                  color="primary"
                  hide-details
                ></v-switch>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <!-- Reset button -->
      <v-btn
        @click="resetToDefaults"
        variant="text"
        class="mt-4"
        prepend-icon="mdi-refresh"
      >
        Réinitialiser aux valeurs par défaut
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { gameConfigSchemas } from '../config/gameSchemas'
import type { GameConfigSchema, ConfigField } from '../config/gameSchemas'

const props = defineProps<{
  schemaId?: string
}>()

const config = defineModel<Record<string, any>>({ default: {} })

const expandedPanels = ref<string[]>(['Base'])
const showPassword = ref<Record<string, boolean>>({})

const schema = computed<GameConfigSchema | null>(() => {
  if (!props.schemaId || !gameConfigSchemas[props.schemaId]) {
    return null
  }
  return gameConfigSchemas[props.schemaId]
})

const groupedFields = computed(() => {
  if (!schema.value) return []

  const groups = new Map<string, ConfigField[]>()

  schema.value.fields.forEach((field) => {
    const groupName = field.group || 'Autres'
    if (!groups.has(groupName)) {
      groups.set(groupName, [])
    }
    groups.get(groupName)!.push(field)
  })

  return Array.from(groups.entries()).map(([name, fields]) => ({
    name,
    fields,
  }))
})

function getGroupIcon(groupName: string): string {
  const icons: Record<string, string> = {
    Base: 'mdi-information',
    Modpack: 'mdi-package-variant',
    Performance: 'mdi-speedometer',
    Serveur: 'mdi-server',
    Monde: 'mdi-earth',
    Permissions: 'mdi-shield-account',
    Sécurité: 'mdi-lock',
    Gameplay: 'mdi-gamepad-variant',
  }
  return icons[groupName] || 'mdi-cog'
}

function resetToDefaults() {
  if (!schema.value) return

  const defaults: Record<string, any> = {}
  schema.value.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaults[field.key] = field.defaultValue
    }
  })
  config.value = defaults
}

// Initialize with defaults when schema changes
watch(() => props.schemaId, () => {
  if (props.schemaId && Object.keys(config.value).length === 0) {
    resetToDefaults()
  }
}, { immediate: true })
</script>
