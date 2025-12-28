#!/bin/bash

# 🚀 Script d'initialisation du Game Server Manager
# Ce script prépare l'environnement et lance l'application

set -e

echo "🎮 Game Server Manager - Initialisation"
echo "========================================"

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Docker et Docker Compose détectés"

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant. Création depuis .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Éditez le fichier .env avec vos vraies valeurs Kinde Auth!"
    read -p "Appuyez sur Entrée pour continuer une fois le .env configuré..."
fi

echo "✅ Fichier .env détecté"

# Installer les dépendances Node
echo "📦 Installation des dépendances..."
npm install

# Générer Prisma Client
echo "🔧 Génération du Prisma Client..."
npx prisma generate

# Démarrer la stack Docker
echo "🐳 Démarrage de la stack Docker..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 10

# Synchroniser le schéma Prisma
echo "🗄️  Synchronisation du schéma de base de données..."
npx prisma db push

echo ""
echo "✅ Initialisation terminée avec succès!"
echo ""
echo "🌐 L'application est accessible sur:"
echo "   http://localhost:80"
echo ""
echo "📊 Commandes utiles:"
echo "   docker-compose logs -f nuxt       # Voir les logs"
echo "   docker-compose ps                 # Voir les services"
echo "   docker-compose down               # Arrêter la stack"
echo "   docker-compose restart nuxt       # Redémarrer l'app"
echo ""
echo "🎮 Bon gaming!"
