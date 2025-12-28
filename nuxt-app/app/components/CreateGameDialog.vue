<template>
  <v-dialog v-model="isOpen" max-width="800" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="purple">mdi-gamepad-variant</v-icon>
        Add New Game
      </v-card-title>
      <v-card-text>
        <!-- Templates Section -->
        <GameTemplates @select="applyTemplate" />

        <!-- Help Card -->
        <v-expansion-panels class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2" color="orange">mdi-help-circle</v-icon>
              Comment remplir ce formulaire ?
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Game Name</v-list-item-title>
                  <v-list-item-subtitle>Le nom de votre jeu (ex: Minecraft Java, Valheim)</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Type</v-list-item-title>
                  <v-list-item-subtitle>
                    <strong>docker</strong> : Pour les jeux utilisant Docker (recommandé)<br>
                    <strong>linuxgsm</strong> : Pour les jeux gérés via LinuxGSM
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Docker Image</v-list-item-title>
                  <v-list-item-subtitle>
                    L'image Docker à utiliser. Cherchez sur <a href="https://hub.docker.com" target="_blank">Docker Hub</a><br>
                    Exemples :<br>
                    • Minecraft Java: <code>itzg/minecraft-server</code><br>
                    • Minecraft Bedrock: <code>itzg/minecraft-bedrock-server</code><br>
                    • Valheim: <code>lloesche/valheim-server</code>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Ports</v-list-item-title>
                  <v-list-item-subtitle>
                    Les ports utilisés par le jeu, séparés par des virgules<br>
                    Exemples :<br>
                    • Minecraft: <code>25565</code><br>
                    • Valheim: <code>2456,2457,2458</code><br>
                    • Terraria: <code>7777</code>
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Volumes</v-list-item-title>
                  <v-list-item-subtitle>
                    Montages de dossiers pour sauvegarder les données, un par ligne<br>
                    Format: <code>chemin_local:chemin_container</code><br>
                    Exemple: <code>./game-data/minecraft:/data</code><br>
                    Consultez la documentation de l'image Docker pour connaître les chemins
                  </v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="font-weight-bold">Public</v-list-item-title>
                  <v-list-item-subtitle>
                    Si activé, tous les utilisateurs peuvent créer des serveurs avec ce jeu
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Form -->
        <v-form ref="form">
          <v-text-field 
            v-model="formData.name" 
            label="Game Name" 
            required
            hint="Ex: Minecraft Java, Valheim Server"
            persistent-hint
            prepend-inner-icon="mdi-controller"
          ></v-text-field>
          
          <v-select
            v-model="formData.type"
            :items="[
              { title: 'Docker (Recommandé)', value: 'docker' },
              { title: 'LinuxGSM', value: 'linuxgsm' }
            ]"
            label="Type"
            required
            class="mt-3"
            prepend-inner-icon="mdi-server"
          ></v-select>
          
          <v-text-field
            v-if="formData.type === 'docker'"
            v-model="formData.image"
            label="Docker Image"
            hint="Ex: itzg/minecraft-server - Cherchez sur hub.docker.com"
            persistent-hint
            class="mt-3"
            prepend-inner-icon="mdi-docker"
          >
            <template v-slot:append>
              <v-btn
                icon
                variant="text"
                size="small"
                href="https://hub.docker.com"
                target="_blank"
              >
                <v-icon size="small">mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-text-field>
          
          <v-text-field
            v-model="formData.portsString"
            label="Ports (séparés par des virgules)"
            hint="Ex: 25565 ou 2456,2457,2458"
            persistent-hint
            class="mt-3"
            prepend-inner-icon="mdi-lan"
          ></v-text-field>
          
          <v-textarea
            v-model="formData.volumesString"
            label="Volumes (un par ligne)"
            hint="Ex: ./game-data/minecraft:/data"
            persistent-hint
            rows="3"
            class="mt-3"
            prepend-inner-icon="mdi-folder"
          ></v-textarea>
          
          <v-switch 
            v-model="formData.public" 
            label="Public (autres utilisateurs peuvent créer des serveurs)"
            color="primary"
            class="mt-3"
          ></v-switch>
        </v-form>

        <!-- Advanced Configuration (if schema available) -->
        <GameConfigEditor
          v-if="formData.schemaId"
          v-model="envConfig"
          :schema-id="formData.schemaId"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">Annuler</v-btn>
        <v-btn color="primary" @click="submit">
          <v-icon class="mr-2">mdi-check</v-icon>
          Créer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const isOpen = defineModel<boolean>()

const emit = defineEmits<{
  'submit': [data: any]
}>()

const formData = ref({
  name: '',
  type: 'docker',
  image: '',
  portsString: '',
  volumesString: '',
  public: false,
  schemaId: undefined as string | undefined,
  dockerUser: undefined as string | undefined,
  dockerPrivileged: false,
  dockerRestart: 'unless-stopped',
})

const envConfig = ref<Record<string, any>>({})

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    type: 'docker',
    image: '',
    portsString: '',
    volumesString: '',
    public: false,
    schemaId: undefined,
    dockerUser: undefined,
    dockerPrivileged: false,
    dockerRestart: 'unless-stopped',
  }
  envConfig.value = {}
}

const applyTemplate = (template: any) => {
  formData.value = { ...template }
  envConfig.value = {} // Reset env config when template changes
}

const submit = () => {
  const ports = formData.value.portsString
    ? formData.value.portsString.split(',').map((p) => parseInt(p.trim())).filter((p) => !isNaN(p))
    : []
  
  const volumes = formData.value.volumesString
    ? formData.value.volumesString.split('\n').filter((v) => v.trim())
    : []

  emit('submit', {
    name: formData.value.name,
    type: formData.value.type,
    image: formData.value.image || null,
    ports,
    volumes,
    public: formData.value.public,
    envConfig: Object.keys(envConfig.value).length > 0 ? envConfig.value : undefined,
    schemaId: formData.value.schemaId,
    dockerUser: formData.value.dockerUser || null,
    dockerPrivileged: formData.value.dockerPrivileged,
    dockerRestart: formData.value.dockerRestart || 'unless-stopped',
  })

  close()
}
</script>
