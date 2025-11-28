<template>
  <div class="pa-4">
    <Header />
    
    <v-container fluid class="mt-4">
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h3 font-weight-bold">Menu de la Cantine</h1>
        <div class="d-flex gap-2">
          <v-btn 
            :color="isEditing ? 'success' : 'primary'" 
            @click="toggleEdit"
            prepend-icon="mdi-pencil"
          >
            {{ isEditing ? 'Enregistrer' : 'Modifier' }}
          </v-btn>
          <v-btn 
            v-if="isEditing"
            color="error" 
            @click="cancelEdit"
            prepend-icon="mdi-close"
          >
            Annuler
          </v-btn>
        </div>
      </div>

      <v-card class="elevation-2">
        <v-card-text class="pa-0">
          <v-table>
            <thead>
              <tr>
                <th class="text-left font-weight-bold text-h6 pa-4" style="width: 120px;">Jour</th>
                <th class="text-left font-weight-bold text-h6 pa-4">Déjeuner</th>
                <th class="text-left font-weight-bold text-h6 pa-4">Dîner</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in weekMenu" :key="day.id" class="menu-row">
                <td class="pa-4">
                  <div class="d-flex flex-column">
                    <span class="text-h6 font-weight-bold">{{ day.name }}</span>
                    <span class="text-caption text-medium-emphasis">{{ day.date }}</span>
                  </div>
                </td>
                <td class="pa-4">
                  <v-card 
                    :class="['meal-card', isEditing ? 'editable' : '']"
                    :elevation="isEditing ? 2 : 0"
                    variant="tonal"
                  >
                    <v-card-text>
                      <div v-if="!isEditing">
                        <div class="text-subtitle-1 font-weight-bold mb-2">
                          {{ day.lunch.title }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                          {{ day.lunch.description }}
                        </div>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="day.lunch.title"
                          label="Plat principal"
                          variant="outlined"
                          density="compact"
                          class="mb-2"
                        />
                        <v-textarea
                          v-model="day.lunch.description"
                          label="Description"
                          variant="outlined"
                          density="compact"
                          rows="2"
                          auto-grow
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </td>
                <td class="pa-4">
                  <v-card 
                    :class="['meal-card', isEditing ? 'editable' : '']"
                    :elevation="isEditing ? 2 : 0"
                    variant="tonal"
                  >
                    <v-card-text>
                      <div v-if="!isEditing">
                        <div class="text-subtitle-1 font-weight-bold mb-2">
                          {{ day.dinner.title }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                          {{ day.dinner.description }}
                        </div>
                      </div>
                      <div v-else>
                        <v-text-field
                          v-model="day.dinner.title"
                          label="Plat principal"
                          variant="outlined"
                          density="compact"
                          class="mb-2"
                        />
                        <v-textarea
                          v-model="day.dinner.description"
                          label="Description"
                          variant="outlined"
                          density="compact"
                          rows="2"
                          auto-grow
                        />
                      </div>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <v-card class="mt-6 elevation-1">
        <v-card-text>
          <div class="d-flex align-center gap-2">
            <v-icon color="info">mdi-information</v-icon>
            <span class="text-body-2">
              Cliquez sur "Modifier" pour éditer le menu de la semaine. Les modifications sont sauvegardées localement.
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from '../components/header.vue'

	definePageMeta({
        middleware: ['auth-logged-in'],
  })

interface Meal {
  title: string
  description: string
}

interface DayMenu {
  id: number
  name: string
  date: string
  lunch: Meal
  dinner: Meal
}

const isEditing = ref(false)
const weekMenu = ref<DayMenu[]>([])
const savedMenu = ref<DayMenu[]>([])

const getWeekDates = () => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  const today = new Date()
  const currentDay = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

  return days.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      name: day,
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }
  })
}

const initializeMenu = () => {
  const weekDates = getWeekDates()
  const defaultMenu: DayMenu[] = [
    {
      id: 1,
      name: weekDates[0].name,
      date: weekDates[0].date,
      lunch: { title: 'Poulet rôti', description: 'Accompagné de légumes de saison et riz basmati' },
      dinner: { title: 'Soupe de légumes', description: 'Soupe maison avec pain frais' }
    },
    {
      id: 2,
      name: weekDates[1].name,
      date: weekDates[1].date,
      lunch: { title: 'Saumon grillé', description: 'Avec purée de pommes de terre et haricots verts' },
      dinner: { title: 'Salade César', description: 'Poulet grillé, croûtons, parmesan' }
    },
    {
      id: 3,
      name: weekDates[2].name,
      date: weekDates[2].date,
      lunch: { title: 'Bœuf bourguignon', description: 'Mijoté avec carottes et champignons, pâtes fraîches' },
      dinner: { title: 'Quiche lorraine', description: 'Accompagnée d\'une salade verte' }
    },
    {
      id: 4,
      name: weekDates[3].name,
      date: weekDates[3].date,
      lunch: { title: 'Curry de légumes', description: 'Curry végétarien avec riz jasmin et naan' },
      dinner: { title: 'Pizza margherita', description: 'Tomate, mozzarella, basilic frais' }
    },
    {
      id: 5,
      name: weekDates[4].name,
      date: weekDates[4].date,
      lunch: { title: 'Poisson pané', description: 'Frites maison et sauce tartare' },
      dinner: { title: 'Pâtes carbonara', description: 'Crème, lardons, parmesan' }
    },
    {
      id: 6,
      name: weekDates[5].name,
      date: weekDates[5].date,
      lunch: { title: 'Couscous royal', description: 'Merguez, poulet, légumes et semoule' },
      dinner: { title: 'Crêpes complètes', description: 'Jambon, fromage, œuf' }
    },
    {
      id: 7,
      name: weekDates[6].name,
      date: weekDates[6].date,
      lunch: { title: 'Rôti de porc', description: 'Pommes de terre rôties et ratatouille' },
      dinner: { title: 'Soupe à l\'oignon', description: 'Gratinée au fromage' }
    }
  ]

  // Load from localStorage if available
  const stored = localStorage.getItem('cantineMenu')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Update dates but keep the meals
      weekMenu.value = parsed.map((item: DayMenu, index: number) => ({
        ...item,
        name: weekDates[index].name,
        date: weekDates[index].date
      }))
    } catch {
      weekMenu.value = defaultMenu
    }
  } else {
    weekMenu.value = defaultMenu
  }
}

const toggleEdit = () => {
  if (isEditing.value) {
    // Save changes
    localStorage.setItem('cantineMenu', JSON.stringify(weekMenu.value))
  } else {
    // Enter edit mode - save current state
    savedMenu.value = JSON.parse(JSON.stringify(weekMenu.value))
  }
  isEditing.value = !isEditing.value
}

const cancelEdit = () => {
  // Restore saved state
  weekMenu.value = JSON.parse(JSON.stringify(savedMenu.value))
  isEditing.value = false
}

onMounted(() => {
  initializeMenu()
})
</script>

<style scoped>
.menu-row {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.menu-row:last-child {
  border-bottom: none;
}

.meal-card {
  transition: all 0.2s ease;
  min-height: 100px;
}

.meal-card.editable {
  cursor: pointer;
}

.meal-card.editable:hover {
  transform: translateY(-2px);
}

.gap-2 {
  gap: 8px;
}
</style>