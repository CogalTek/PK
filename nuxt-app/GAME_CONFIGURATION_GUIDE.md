# 🎮 Guide de Configuration des Serveurs de Jeux

## 📋 Table des matières
- [Minecraft Java](#minecraft-java)
- [Valheim](#valheim)
- [Palworld](#palworld)
- [Terraria](#terraria)
- [Configuration personnalisée](#configuration-personnalisée)

---

## 🎯 Minecraft Java

### Configuration de base
- **Image Docker**: `itzg/minecraft-server`
- **Port**: `25565`
- **Volume**: `./game-data/minecraft:/data`

### Options de configuration disponibles

#### 🔧 Base
| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `EULA` | Acceptation de l'EULA Minecraft | `true` |
| `VERSION` | Version de Minecraft | `LATEST` |
| `TYPE` | Type de serveur | `VANILLA` |

#### 📦 Types de serveur disponibles
- **VANILLA** - Minecraft officiel
- **FORGE** - Avec support des mods Forge
- **FABRIC** - Avec support des mods Fabric
- **PAPER** - Optimisé pour les performances
- **SPIGOT** - Support des plugins
- **BUKKIT** - Support des plugins Bukkit
- **PURPUR** - Fork de Paper avec fonctionnalités supplémentaires
- **CURSEFORGE** - Modpack depuis Curseforge
- **MODRINTH** - Modpack depuis Modrinth

#### 🎒 Modpacks
Pour utiliser un modpack **Curseforge** :
1. Sélectionnez `TYPE = CURSEFORGE`
2. Renseignez `CF_PAGE_URL` avec l'URL du modpack
   - Exemple: `https://www.curseforge.com/minecraft/modpacks/all-the-mods-9`

Pour utiliser un modpack **Modrinth** :
1. Sélectionnez `TYPE = MODRINTH`
2. Renseignez `MODRINTH_PROJECT` avec le slug du projet
   - Exemple: `fabric-tailor`

#### 💾 Performance
| Variable | Description | Exemple |
|----------|-------------|---------|
| `MEMORY` | RAM allouée | `4G`, `8G` |
| `MAX_MEMORY` | RAM maximale | `4G`, `8G` |

#### ⚙️ Configuration serveur
| Variable | Description | Valeurs |
|----------|-------------|---------|
| `SERVER_NAME` | Nom du serveur | Texte libre |
| `MOTD` | Message du jour | Texte libre |
| `MODE` | Mode de jeu | `survival`, `creative`, `adventure`, `spectator` |
| `DIFFICULTY` | Difficulté | `peaceful`, `easy`, `normal`, `hard` |
| `MAX_PLAYERS` | Joueurs max | Nombre (ex: `20`) |

#### 🌍 Monde
| Variable | Description | Valeurs |
|----------|-------------|---------|
| `ALLOW_NETHER` | Activer le Nether | `true`, `false` |
| `SPAWN_PROTECTION` | Protection spawn (blocs) | Nombre (ex: `16`) |
| `VIEW_DISTANCE` | Distance de vue (chunks) | Nombre (ex: `10`) |
| `SEED` | Seed du monde | Texte (vide = aléatoire) |
| `LEVEL_TYPE` | Type de monde | `default`, `flat`, `largeBiomes`, `amplified` |

#### 👤 Permissions
| Variable | Description | Format |
|----------|-------------|--------|
| `OPS` | Opérateurs (admin) | Noms séparés par virgules: `Player1,Player2` |
| `WHITELIST` | Liste blanche | Noms séparés par virgules: `Player1,Player2` |
| `ENABLE_WHITELIST` | Activer whitelist | `true`, `false` |

#### 🔒 Sécurité
| Variable | Description | Valeurs |
|----------|-------------|---------|
| `ONLINE_MODE` | Vérification Mojang | `true` (recommandé), `false` |

#### 🎮 Gameplay
| Variable | Description | Valeurs |
|----------|-------------|---------|
| `PVP` | Combat entre joueurs | `true`, `false` |
| `ENABLE_COMMAND_BLOCK` | Command blocks | `true`, `false` |

### Exemples de configuration

#### Serveur Vanilla simple
```json
{
  "EULA": "true",
  "VERSION": "1.20.4",
  "TYPE": "VANILLA",
  "MEMORY": "2G",
  "SERVER_NAME": "Mon Serveur Survival",
  "MODE": "survival",
  "DIFFICULTY": "normal",
  "MAX_PLAYERS": "10",
  "OPS": "MonPseudo"
}
```

#### Serveur avec Modpack Curseforge
```json
{
  "EULA": "true",
  "TYPE": "CURSEFORGE",
  "CF_PAGE_URL": "https://www.curseforge.com/minecraft/modpacks/all-the-mods-9",
  "MEMORY": "8G",
  "MAX_MEMORY": "8G",
  "SERVER_NAME": "ATM9 Server",
  "OPS": "Admin1,Admin2"
}
```

#### Serveur Paper optimisé
```json
{
  "EULA": "true",
  "VERSION": "1.20.4",
  "TYPE": "PAPER",
  "MEMORY": "4G",
  "MAX_MEMORY": "4G",
  "VIEW_DISTANCE": "8",
  "MAX_PLAYERS": "50",
  "OPS": "AdminPrincipal"
}
```

---

## ⚔️ Valheim

### Configuration de base
- **Image Docker**: `lloesche/valheim-server`
- **Ports**: `2456,2457,2458`
- **Volumes**: 
  - `./game-data/valheim:/config`
  - `./game-data/valheim-data:/opt/valheim`

### Options de configuration

| Variable | Description | Requis | Exemple |
|----------|-------------|--------|---------|
| `SERVER_NAME` | Nom du serveur | ✅ | `Mon Serveur Valheim` |
| `WORLD_NAME` | Nom du monde | ✅ | `Dedicated` |
| `SERVER_PASS` | Mot de passe | ✅ | `motdepasse123` (min 5 caractères) |
| `SERVER_PUBLIC` | Serveur public | ❌ | `true`, `false` |
| `ADMINLIST_IDS` | Steam IDs admin | ❌ | `76561198123456789,76561198987654321` |
| `PERMITTEDLIST_IDS` | Steam IDs autorisés | ❌ | `76561198123456789` |

### Exemple
```json
{
  "SERVER_NAME": "Vikings du Nord",
  "WORLD_NAME": "Midgard",
  "SERVER_PASS": "odin2024",
  "SERVER_PUBLIC": "true",
  "ADMINLIST_IDS": "76561198123456789"
}
```

---

## 🦖 Palworld

### Configuration de base
- **Image Docker**: `thijsvanloef/palworld-server-docker`
- **Port**: `8211`
- **Volume**: `./game-data/palworld:/palworld`

### Options de configuration

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SERVER_NAME` | Nom du serveur | `Mon Serveur Palworld` |
| `SERVER_PASSWORD` | Mot de passe joueurs | `password123` |
| `ADMIN_PASSWORD` | Mot de passe admin (requis) | `adminpass123` |
| `MAX_PLAYERS` | Joueurs max | `32` |
| `DIFFICULTY` | Difficulté | `Easy`, `Normal`, `Hard` |
| `DAY_TIME_SPEED_RATE` | Vitesse du jour | `1.0` |
| `NIGHT_TIME_SPEED_RATE` | Vitesse de la nuit | `1.0` |

---

## 🎯 Terraria

### Configuration de base
- **Image Docker**: `ryshe/terraria`
- **Port**: `7777`
- **Volume**: `./game-data/terraria:/world`

### Options de configuration

| Variable | Description | Valeurs |
|----------|-------------|---------|
| `WORLD_NAME` | Nom du monde | `World` |
| `MAX_PLAYERS` | Joueurs max | `8` |
| `PASSWORD` | Mot de passe | Optionnel |
| `DIFFICULTY` | Difficulté | `0` (Normal), `1` (Expert), `2` (Master), `3` (Journey) |

---

## 🔧 Configuration personnalisée

### Pour ajouter un nouveau jeu

1. **Trouvez l'image Docker** sur [Docker Hub](https://hub.docker.com)
2. **Consultez la documentation** de l'image pour connaître :
   - Les ports utilisés
   - Les volumes nécessaires
   - Les variables d'environnement disponibles
3. **Créez le jeu** dans l'interface
4. **Configurez les variables** d'environnement selon vos besoins

### Exemples d'images populaires

- **CS:GO**: `cm2network/csgo`
- **Rust**: `didstopia/rust-server`
- **Ark**: `thmhoag/arkserver`
- **Factorio**: `factoriotools/factorio`
- **Project Zomboid**: `renegademaster/zomboid-dedicated-server`

---

## 📚 Ressources utiles

- [Docker Hub](https://hub.docker.com) - Trouver des images Docker
- [itzg/minecraft-server Documentation](https://docker-minecraft-server.readthedocs.io/) - Guide complet Minecraft
- [Valheim Server Documentation](https://github.com/lloesche/valheim-server-docker) - Guide Valheim
- [LinuxGSM](https://linuxgsm.com/) - Alternative pour gérer des serveurs de jeux

---

## 💡 Conseils

1. **RAM**: Allouez suffisamment de RAM pour éviter les lags
2. **Sauvegardes**: Les données sont dans `./game-data/`, pensez à sauvegarder
3. **Ports**: Assurez-vous que les ports sont bien ouverts sur votre firewall
4. **Admins**: Configurez toujours au moins un administrateur
5. **Modpacks**: Les modpacks nécessitent généralement plus de RAM (6-8G minimum)
