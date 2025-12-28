# Script d'initialisation du Game Server Manager (Windows)
# Ce script prepare l'environnement et lance l'application

Write-Host "Game Server Manager - Initialisation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Docker est installé
try {
    $null = docker --version
    Write-Host "[OK] Docker detecte" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Docker n'est pas installe. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Verifier que Docker Compose est installe
try {
    $null = docker-compose --version
    Write-Host "[OK] Docker Compose detecte" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Docker Compose n'est pas installe. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Verifier que le fichier .env existe
if (-not (Test-Path .env)) {
    Write-Host "[ATTENTION] Fichier .env manquant. Creation depuis .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "[ATTENTION] IMPORTANT: Editez le fichier .env avec vos vraies valeurs Kinde Auth!" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entree pour continuer une fois le .env configure"
}

Write-Host "[OK] Fichier .env detecte" -ForegroundColor Green

# Installer les dependances Node
Write-Host ""
Write-Host "[ETAPE] Installation des dependances..." -ForegroundColor Cyan
npm install

# Generer Prisma Client
Write-Host ""
Write-Host "[ETAPE] Generation du Prisma Client..." -ForegroundColor Cyan
npx prisma generate

# Demarrer la stack Docker
Write-Host ""
Write-Host "[ETAPE] Demarrage de la stack Docker..." -ForegroundColor Cyan
docker-compose up -d

# Attendre que la base de donnees soit prete
Write-Host ""
Write-Host "[ETAPE] Attente de la base de donnees..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Synchroniser le schema Prisma
Write-Host ""
Write-Host "[ETAPE] Synchronisation du schema de base de donnees..." -ForegroundColor Cyan
npx prisma db push

Write-Host ""
Write-Host "[SUCCES] Initialisation terminee avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "L'application est accessible sur:" -ForegroundColor Cyan
Write-Host "   http://localhost:80" -ForegroundColor White
Write-Host ""
Write-Host "Commandes utiles:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f nuxt       # Voir les logs" -ForegroundColor White
Write-Host "   docker-compose ps                 # Voir les services" -ForegroundColor White
Write-Host "   docker-compose down               # Arreter la stack" -ForegroundColor White
Write-Host "   docker-compose restart nuxt       # Redemarrer l'app" -ForegroundColor White
Write-Host ""
Write-Host "Bon gaming!" -ForegroundColor Green
