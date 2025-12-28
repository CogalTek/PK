// Script pour enlever dockerUser: root des games ARK
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeArkRootUser() {
  console.log('🔧 Suppression de dockerUser: root pour ARK...')

  // Trouver tous les games ARK
  const arkGames = await prisma.game.findMany({
    where: {
      image: 'thmhoag/arkserver'
    }
  })

  console.log(`📊 ${arkGames.length} game(s) ARK trouvé(s)`)

  for (const game of arkGames) {
    console.log(`✏️  Mise à jour du game: ${game.name} (${game.id})`)
    console.log(`   Ancien dockerUser: ${game.dockerUser}`)
    
    await prisma.game.update({
      where: { id: game.id },
      data: {
        dockerUser: null, // Enlever l'utilisateur root
      }
    })
    
    console.log(`✅ Game ${game.name} mis à jour - dockerUser supprimé`)
  }

  console.log('🎉 Migration terminée !')
}

removeArkRootUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
