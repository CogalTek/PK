# PK - Game Server Manager Dashboard

🎮 Dashboard Nuxt.js pour gérer dynamiquement des serveurs de jeux (Minecraft, FiveM, Valheim, etc.) via Docker et LinuxGSM.

## 🎯 Fonctionnalités

- ✅ **Gestion de jeux** : Ajouter des configurations de jeux (Docker, LinuxGSM)
- ✅ **Instances de serveurs** : Créer, démarrer, arrêter et supprimer des serveurs
- ✅ **Exécution Docker** : Pilotage de containers Docker via l'API Nitro
- ✅ **Interface moderne** : Dashboard Vuetify avec gestion en temps réel
- ✅ **Multi-tenant** : Isolation par utilisateur avec Kinde Auth
- ✅ **CI/CD Jenkins** : Pipeline automatisé pour build et déploiement

## 📦 Stack technique

- **Frontend** : Nuxt 4 + Vue 3 + Vuetify 3
- **Backend** : Nitro API + Prisma ORM
- **Base de données** : PostgreSQL
- **Containerisation** : Docker + Docker Compose
- **CI/CD** : Jenkins
- **Auth** : Kinde

## 🚀 Installation locale

### Prérequis

- Node.js 18+
- Docker et Docker Compose
- PostgreSQL (ou utiliser le container Docker)

### Étapes

1. **Cloner le dépôt**

\`\`\`bash
git clone https://github.com/CogalTek/PK.git
cd PK/nuxt-app
\`\`\`

2. **Installer les dépendances**

\`\`\`bash
npm install
\`\`\`

3. **Configurer les variables d'environnement**

Créer un fichier \`.env\` (ou utiliser celui existant) :

\`\`\`env
DATABASE_URL="postgresql://paketekos:PasswordAChier@localhost:5432/homelab"

NUXT_KINDE_CLIENT_ID=your_client_id
NUXT_KINDE_CLIENT_SECRET=your_client_secret
NUXT_KINDE_AUTH_DOMAIN=https://your-domain.kinde.com
NUXT_KINDE_REDIRECT_URL=http://localhost:3000/api/callback
NUXT_KINDE_LOGOUT_REDIRECT_URL=http://localhost:3000
NUXT_KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/login-redirect
NUXT_KINDE_PASSWORD=your_password
\`\`\`

4. **Synchroniser la base de données**

\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

5. **Lancer en développement**

\`\`\`bash
npm run dev
\`\`\`

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🐳 Déploiement Docker

### Avec Docker Compose (recommandé)

\`\`\`bash
cd nuxt-app
docker-compose up -d
\`\`\`

Cela démarre :
- PostgreSQL (port 5432)
- Nuxt App (port 80)

### Build manuel

\`\`\`bash
docker build -t pk-nuxt-app .
docker run -p 3000:3000 \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -e DATABASE_URL="postgresql://..." \\
  pk-nuxt-app
\`\`\`

## 📚 API Endpoints

### Games

- \`GET /api/games\` - Liste tous les jeux
- \`POST /api/games\` - Créer un nouveau jeu
- \`GET /api/games/:id\` - Détails d'un jeu
- \`DELETE /api/games/:id\` - Supprimer un jeu

### Servers

- \`GET /api/servers\` - Liste tous les serveurs
- \`POST /api/servers\` - Créer une instance de serveur
- \`GET /api/servers/:id\` - Détails d'un serveur
- \`DELETE /api/servers/:id\` - Supprimer un serveur
- \`POST /api/servers/:id/start\` - Démarrer un serveur
- \`POST /api/servers/:id/stop\` - Arrêter un serveur
- \`GET /api/servers/:id/logs\` - Récupérer les logs

## 🎮 Exemples de jeux supportés

### Minecraft (Docker)

\`\`\`json
{
  "name": "Minecraft Java",
  "type": "docker",
  "image": "itzg/minecraft-server",
  "ports": [25565],
  "volumes": ["./game-data/minecraft:/data"],
  "env": { "EULA": "TRUE", "TYPE": "PAPER" }
}
\`\`\`

### Valheim (Docker)

\`\`\`json
{
  "name": "Valheim",
  "type": "docker",
  "image": "lloesche/valheim-server",
  "ports": [2456, 2457, 2458],
  "volumes": ["./game-data/valheim:/config"],
  "env": { "SERVER_NAME": "My Server", "WORLD_NAME": "Dedicated" }
}
\`\`\`

## 🔧 Architecture

\`\`\`
PK/
├── nuxt-app/
│   ├── app/
│   │   ├── pages/
│   │   │   └── games.vue          # Dashboard principal
│   │   └── components/             # Composants réutilisables
│   ├── server/
│   │   ├── api/
│   │   │   ├── games/              # Routes API Games
│   │   │   └── servers/            # Routes API Servers
│   │   └── utils/
│   │       ├── prisma.ts           # Client Prisma
│   │       └── dockerRunner.ts     # Exécuteur Docker
│   ├── prisma/
│   │   └── schema.prisma           # Schéma de base de données
│   ├── docker-compose.yml          # Stack Docker complète
│   └── Dockerfile                  # Image de l'application
└── Jenkinsfile                      # Pipeline CI/CD
\`\`\`

## 🔐 Sécurité

- **Authentification** : Kinde Auth avec JWT
- **Isolation** : Chaque utilisateur ne voit que ses ressources
- **Sanitization** : Validation et nettoyage des entrées (noms de containers, commandes)
- **Timeouts** : Protection contre les opérations longues
- **Docker Socket** : Accès limité et sécurisé au socket Docker

## 🧪 Tests (à venir)

\`\`\`bash
npm run test
\`\`\`

## 📝 TODO

- [ ] Support LinuxGSM (SSH remote execution)
- [ ] WebSocket pour status en temps réel
- [ ] Metrics et monitoring (Prometheus)
- [ ] Backups automatiques
- [ ] Templates de jeux prédéfinis
- [ ] Multi-host support (Docker Swarm/Kubernetes)

## 🤝 Contribuer

Les contributions sont les bienvenues ! Merci de :

1. Fork le projet
2. Créer une branche feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit les changements (\`git commit -m 'Add AmazingFeature'\`)
4. Push vers la branche (\`git push origin feature/AmazingFeature\`)
5. Ouvrir une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 👥 Auteurs

- **CogalTek** - Développement initial

## 🙏 Remerciements

- [Nuxt](https://nuxt.com/)
- [Prisma](https://www.prisma.io/)
- [Vuetify](https://vuetifyjs.com/)
- [Docker](https://www.docker.com/)
- [Kinde](https://kinde.com/)
