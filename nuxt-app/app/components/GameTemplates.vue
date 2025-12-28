<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex align-center">
      <v-icon class="mr-2" color="amber">mdi-lightbulb</v-icon>
      Quick Templates
    </v-card-title>
    <v-card-text>
      <v-chip-group>
        <v-chip
          v-for="template in templates"
          :key="template.name"
          @click="$emit('select', template)"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-rocket-launch"
        >
          {{ template.name }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'select': [template: GameTemplate]
}>()

interface GameTemplate {
  name: string
  type: string
  image: string
  portsString: string
  volumesString: string
  public: boolean
  schemaId?: string
  dockerUser?: string
  dockerPrivileged?: boolean
  dockerRestart?: string
}

const templates: GameTemplate[] = [
  {
    name: 'Minecraft Java',
    type: 'docker',
    image: 'itzg/minecraft-server',
    portsString: '25565',
    volumesString: './game-data/minecraft:/data',
    public: false,
    schemaId: 'minecraft-java',
  },
  {
    name: 'Minecraft Bedrock',
    type: 'docker',
    image: 'itzg/minecraft-bedrock-server',
    portsString: '19132',
    volumesString: './game-data/minecraft-bedrock:/data',
    public: false,
  },
  {
    name: 'Valheim',
    type: 'docker',
    image: 'lloesche/valheim-server',
    portsString: '2456,2457,2458',
    volumesString: './game-data/valheim:/config\n./game-data/valheim-data:/opt/valheim',
    public: false,
    schemaId: 'valheim',
  },
  {
    name: 'Palworld',
    type: 'docker',
    image: 'thijsvanloef/palworld-server-docker',
    portsString: '8211',
    volumesString: './game-data/palworld:/palworld',
    public: false,
    schemaId: 'palworld',
  },
  {
    name: 'Terraria',
    type: 'docker',
    image: 'ryshe/terraria',
    portsString: '7777',
    volumesString: './game-data/terraria:/world',
    public: false,
    schemaId: 'terraria',
  },
  {
    name: 'CS:GO',
    type: 'docker',
    image: 'cm2network/csgo',
    portsString: '27015,27020',
    volumesString: './game-data/csgo:/home/steam/csgo-dedicated',
    public: false,
  },
  {
    name: 'Rust',
    type: 'docker',
    image: 'didstopia/rust-server',
    portsString: '28015,28016',
    volumesString: './game-data/rust:/steamcmd/rust',
    public: false,
  },
  {
    name: 'Ark: Survival Evolved',
    type: 'docker',
    image: 'hermsi/ark-server', // Image plus simple et sans problèmes de permissions
    portsString: '7777,7778,27015',
    volumesString: './game-data/ark:/ark',
    public: false,
    dockerUser: undefined,
    dockerPrivileged: false,
    dockerRestart: 'unless-stopped',
  },
]
</script>
