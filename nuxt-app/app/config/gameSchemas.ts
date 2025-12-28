// Game configuration schemas - définit les variables d'environnement pour chaque type de jeu

export interface ConfigField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'boolean' | 'password'
  defaultValue?: any
  options?: { title: string; value: any }[]
  hint?: string
  required?: boolean
  group?: string
}

export interface GameConfigSchema {
  name: string
  image: string
  fields: ConfigField[]
}

export const gameConfigSchemas: Record<string, GameConfigSchema> = {
  'minecraft-java': {
    name: 'Minecraft Java',
    image: 'itzg/minecraft-server',
    fields: [
      {
        key: 'EULA',
        label: 'Accept EULA',
        type: 'boolean',
        defaultValue: true,
        hint: 'Vous devez accepter l\'EULA de Minecraft',
        required: true,
        group: 'Base',
      },
      {
        key: 'VERSION',
        label: 'Version Minecraft',
        type: 'text',
        defaultValue: 'LATEST',
        hint: 'Ex: 1.20.4, 1.19.2, LATEST',
        group: 'Base',
      },
      {
        key: 'TYPE',
        label: 'Type de serveur',
        type: 'select',
        defaultValue: 'VANILLA',
        options: [
          { title: 'Vanilla', value: 'VANILLA' },
          { title: 'Forge', value: 'FORGE' },
          { title: 'Fabric', value: 'FABRIC' },
          { title: 'Paper', value: 'PAPER' },
          { title: 'Spigot', value: 'SPIGOT' },
          { title: 'Bukkit', value: 'BUKKIT' },
          { title: 'Purpur', value: 'PURPUR' },
          { title: 'Curseforge Modpack', value: 'CURSEFORGE' },
          { title: 'Modrinth Modpack', value: 'MODRINTH' },
        ],
        group: 'Base',
      },
      {
        key: 'CF_PAGE_URL',
        label: 'URL Curseforge Modpack',
        type: 'text',
        hint: 'Ex: https://www.curseforge.com/minecraft/modpacks/...',
        group: 'Modpack',
      },
      {
        key: 'MODRINTH_PROJECT',
        label: 'Projet Modrinth',
        type: 'text',
        hint: 'Slug ou ID du projet Modrinth',
        group: 'Modpack',
      },
      {
        key: 'MEMORY',
        label: 'RAM (ex: 2G, 4G, 8G)',
        type: 'text',
        defaultValue: '2G',
        hint: 'Quantité de RAM allouée',
        group: 'Performance',
      },
      {
        key: 'MAX_MEMORY',
        label: 'RAM Maximum',
        type: 'text',
        defaultValue: '2G',
        hint: 'RAM maximale',
        group: 'Performance',
      },
      {
        key: 'SERVER_NAME',
        label: 'Nom du serveur',
        type: 'text',
        defaultValue: 'My Minecraft Server',
        group: 'Serveur',
      },
      {
        key: 'MOTD',
        label: 'Message du jour',
        type: 'text',
        defaultValue: 'Bienvenue sur mon serveur !',
        group: 'Serveur',
      },
      {
        key: 'MODE',
        label: 'Mode de jeu',
        type: 'select',
        defaultValue: 'survival',
        options: [
          { title: 'Survival', value: 'survival' },
          { title: 'Creative', value: 'creative' },
          { title: 'Adventure', value: 'adventure' },
          { title: 'Spectator', value: 'spectator' },
        ],
        group: 'Serveur',
      },
      {
        key: 'DIFFICULTY',
        label: 'Difficulté',
        type: 'select',
        defaultValue: 'normal',
        options: [
          { title: 'Peaceful', value: 'peaceful' },
          { title: 'Easy', value: 'easy' },
          { title: 'Normal', value: 'normal' },
          { title: 'Hard', value: 'hard' },
        ],
        group: 'Serveur',
      },
      {
        key: 'MAX_PLAYERS',
        label: 'Joueurs maximum',
        type: 'number',
        defaultValue: 20,
        group: 'Serveur',
      },
      {
        key: 'ALLOW_NETHER',
        label: 'Activer le Nether',
        type: 'boolean',
        defaultValue: true,
        group: 'Monde',
      },
      {
        key: 'SPAWN_PROTECTION',
        label: 'Protection du spawn (blocs)',
        type: 'number',
        defaultValue: 16,
        group: 'Monde',
      },
      {
        key: 'VIEW_DISTANCE',
        label: 'Distance de vue (chunks)',
        type: 'number',
        defaultValue: 10,
        group: 'Monde',
      },
      {
        key: 'SEED',
        label: 'Seed du monde',
        type: 'text',
        hint: 'Laissez vide pour aléatoire',
        group: 'Monde',
      },
      {
        key: 'LEVEL_TYPE',
        label: 'Type de monde',
        type: 'select',
        defaultValue: 'default',
        options: [
          { title: 'Default', value: 'default' },
          { title: 'Flat', value: 'flat' },
          { title: 'Large Biomes', value: 'largeBiomes' },
          { title: 'Amplified', value: 'amplified' },
        ],
        group: 'Monde',
      },
      {
        key: 'OPS',
        label: 'Opérateurs (admin)',
        type: 'text',
        hint: 'Noms d\'utilisateur séparés par des virgules',
        group: 'Permissions',
      },
      {
        key: 'WHITELIST',
        label: 'Liste blanche',
        type: 'text',
        hint: 'Noms d\'utilisateur séparés par des virgules',
        group: 'Permissions',
      },
      {
        key: 'ENABLE_WHITELIST',
        label: 'Activer la liste blanche',
        type: 'boolean',
        defaultValue: false,
        group: 'Permissions',
      },
      {
        key: 'ONLINE_MODE',
        label: 'Mode en ligne (vérification Mojang)',
        type: 'boolean',
        defaultValue: true,
        group: 'Sécurité',
      },
      {
        key: 'PVP',
        label: 'Activer le PvP',
        type: 'boolean',
        defaultValue: true,
        group: 'Gameplay',
      },
      {
        key: 'ENABLE_COMMAND_BLOCK',
        label: 'Activer les command blocks',
        type: 'boolean',
        defaultValue: false,
        group: 'Gameplay',
      },
    ],
  },
  'valheim': {
    name: 'Valheim',
    image: 'lloesche/valheim-server',
    fields: [
      {
        key: 'SERVER_NAME',
        label: 'Nom du serveur',
        type: 'text',
        defaultValue: 'My Valheim Server',
        required: true,
        group: 'Base',
      },
      {
        key: 'WORLD_NAME',
        label: 'Nom du monde',
        type: 'text',
        defaultValue: 'Dedicated',
        required: true,
        group: 'Base',
      },
      {
        key: 'SERVER_PASS',
        label: 'Mot de passe',
        type: 'password',
        required: true,
        hint: 'Au moins 5 caractères',
        group: 'Sécurité',
      },
      {
        key: 'SERVER_PUBLIC',
        label: 'Serveur public',
        type: 'boolean',
        defaultValue: true,
        group: 'Base',
      },
      {
        key: 'ADMINLIST_IDS',
        label: 'IDs Steam des admins',
        type: 'text',
        hint: 'IDs séparés par des virgules',
        group: 'Permissions',
      },
      {
        key: 'PERMITTEDLIST_IDS',
        label: 'IDs Steam autorisés',
        type: 'text',
        hint: 'IDs séparés par des virgules',
        group: 'Permissions',
      },
    ],
  },
  'palworld': {
    name: 'Palworld',
    image: 'thijsvanloef/palworld-server-docker',
    fields: [
      {
        key: 'SERVER_NAME',
        label: 'Nom du serveur',
        type: 'text',
        defaultValue: 'My Palworld Server',
        group: 'Base',
      },
      {
        key: 'SERVER_PASSWORD',
        label: 'Mot de passe',
        type: 'password',
        group: 'Sécurité',
      },
      {
        key: 'ADMIN_PASSWORD',
        label: 'Mot de passe admin',
        type: 'password',
        required: true,
        group: 'Permissions',
      },
      {
        key: 'MAX_PLAYERS',
        label: 'Joueurs maximum',
        type: 'number',
        defaultValue: 32,
        group: 'Base',
      },
      {
        key: 'DIFFICULTY',
        label: 'Difficulté',
        type: 'select',
        defaultValue: 'Normal',
        options: [
          { title: 'Easy', value: 'Easy' },
          { title: 'Normal', value: 'Normal' },
          { title: 'Hard', value: 'Hard' },
        ],
        group: 'Gameplay',
      },
      {
        key: 'DAY_TIME_SPEED_RATE',
        label: 'Vitesse du jour',
        type: 'number',
        defaultValue: 1.0,
        group: 'Gameplay',
      },
      {
        key: 'NIGHT_TIME_SPEED_RATE',
        label: 'Vitesse de la nuit',
        type: 'number',
        defaultValue: 1.0,
        group: 'Gameplay',
      },
    ],
  },
  'terraria': {
    name: 'Terraria',
    image: 'ryshe/terraria',
    fields: [
      {
        key: 'WORLD_NAME',
        label: 'Nom du monde',
        type: 'text',
        defaultValue: 'World',
        required: true,
        group: 'Base',
      },
      {
        key: 'MAX_PLAYERS',
        label: 'Joueurs maximum',
        type: 'number',
        defaultValue: 8,
        group: 'Base',
      },
      {
        key: 'PASSWORD',
        label: 'Mot de passe',
        type: 'password',
        group: 'Sécurité',
      },
      {
        key: 'DIFFICULTY',
        label: 'Difficulté',
        type: 'select',
        defaultValue: '0',
        options: [
          { title: 'Normal', value: '0' },
          { title: 'Expert', value: '1' },
          { title: 'Master', value: '2' },
          { title: 'Journey', value: '3' },
        ],
        group: 'Gameplay',
      },
    ],
  },
}
