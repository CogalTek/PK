# 🎮 Game Server Manager - Guide de démarrage rapide

## ✅ Ce qui a été créé

### 1. **Base de données Prisma** ✓
- Modèle `Game` : Configurations de jeux (Docker/LinuxGSM)
- Modèle `Server` : Instances de serveurs avec états (STOPPED, RUNNING, etc.)
- Relations avec `User` pour multi-tenant

### 2. **API Nitro complète** ✓
- **Games** : CRUD complet (`/api/games`)
- **Servers** : CRUD + start/stop/logs (`/api/servers`)
- Validation des payloads et permissions par utilisateur

### 3. **Docker Runner** ✓
- Exécution sécurisée de commandes Docker
- Sanitization des noms de containers
- Timeouts et gestion d'erreurs
- Support ports, volumes, env variables

### 4. **Interface utilisateur** ✓
- Page `/games` avec onglets Games et Servers
- Dialogs de création avec formulaires
- Actions start/stop/delete
- Visualisation des logs
- Status en temps réel avec couleurs

### 5. **Stack Docker** ✓
- `docker-compose.yml` avec PostgreSQL + Nuxt
- Accès au socket Docker (`/var/run/docker.sock`)
- Health checks et restart policies
- Networks et volumes configurés

### 6. **Pipeline Jenkins** ✓
- Build automatisé
- Tests et linting
- Migrations Prisma
- Déploiement Docker Compose
- Health checks post-déploiement

### 7. **Documentation** ✓
- README complet avec exemples
- `.env.example` pour configuration
- Architecture et API docs

## 🚀 Démarrage rapide

### Option 1 : Développement local

\`\`\`powershell
cd c:\Users\rioma\delivery\hub\PK\nuxt-app

# Installer les dépendances (avec vitest)
npm install

# Synchroniser la base de données
npx prisma db push
npx prisma generate

# Lancer en dev
npm run dev
\`\`\`

### Option 2 : Docker Compose (Production)

\`\`\`powershell
cd c:\Users\rioma\delivery\hub\PK\nuxt-app

# Démarrer toute la stack
docker-compose up -d

# Vérifier les logs
docker-compose logs -f nuxt

# Accéder à l'app
# http://localhost:80
\`\`\`

## 📋 Checklist de configuration

- [ ] Configurer Kinde Auth dans `.env` (NUXT_KINDE_*)
- [ ] Vérifier DATABASE_URL dans `.env`
- [ ] Installer Docker sur la machine hôte
- [ ] Configurer Jenkins avec le Jenkinsfile
- [ ] Tester la création d'un jeu
- [ ] Tester la création et le démarrage d'un serveur

## 🎯 Prochaines étapes suggérées

1. **Tester l'intégration complète** :
   - Créer un jeu Minecraft
   - Lancer une instance
   - Vérifier les logs

2. **Améliorer la sécurité** :
   - Ajouter rate limiting
   - Mettre en place RBAC
   - Isoler les containers par réseau

3. **Monitoring** :
   - Intégrer Prometheus/Grafana
   - Logs centralisés (ELK/Loki)
   - Alertes sur échecs

4. **Features avancées** :
   - WebSocket pour status en temps réel
   - Support LinuxGSM
   - Templates de jeux pré-configurés
   - Backups automatiques

## 🐛 Troubleshooting

### Erreur de connexion à la base de données
\`\`\`powershell
# Vérifier que Postgres est lancé
docker-compose ps

# Tester la connexion
docker exec -it pk-postgres psql -U paketekos -d homelab
\`\`\`

### Docker socket non accessible
\`\`\`powershell
# Windows : s'assurer que Docker Desktop est lancé
# Linux : vérifier les permissions
sudo chmod 666 /var/run/docker.sock
\`\`\`

### Erreur Prisma
\`\`\`powershell
# Regénérer le client
npx prisma generate

# Resynchroniser la base
npx prisma db push
\`\`\`

## 📞 Support

Ouvrir une issue sur GitHub : https://github.com/CogalTek/PK/issues

---

**Bon déploiement ! 🚀**
