// Script pour corriger les permissions des games ARK existants
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixArkPermissions() {
  console.log('🔧 Correction des permissions ARK...')

  // Trouver tous les games ARK
  const arkGames = await prisma.game.findMany({
    where: {
      image: 'thmhoag/arkserver'
    }
  })

  console.log(`📊 ${arkGames.length} game(s) ARK trouvé(s)`)

  for (const game of arkGames) {
    console.log(`✏️  Mise à jour du game: ${game.name} (${game.id})`)
    
    await prisma.game.update({
      where: { id: game.id },
      data: {
        dockerUser: 'root',
        dockerPrivileged: false,
        dockerRestart: 'unless-stopped'
      }
    })
    
    console.log(`✅ Game ${game.name} mis à jour avec dockerUser: root`)
  }

  console.log('🎉 Migration terminée !')
}

fixArkPermissions()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
