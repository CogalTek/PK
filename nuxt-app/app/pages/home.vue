<template>
  <v-app>
    <Header />
    
    <v-main class="d-flex align-center justify-center" style="min-height: 92vh;">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <!-- Carte principale avec l'heure et la date -->
            <v-card class="pa-8 mb-6" elevation="4">
              <v-card-text class="text-center">
                <div class="text-h1 font-weight-bold mb-4" style="font-size: 5rem;">
                  {{ currentTime }}
                </div>
                <div class="text-h4 text-medium-emphasis mb-2">
                  {{ currentDate }}
                </div>
                <div class="text-h6 text-medium-emphasis">
                  {{ currentDay }}
                </div>
              </v-card-text>
            </v-card>

            <!-- Cartes d'informations supplémentaires -->
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-card class="pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-3">
                      mdi-calendar-month
                    </v-icon>
                    <div class="text-h6 mb-2">Semaine</div>
                    <div class="text-h4 font-weight-bold">
                      {{ weekNumber }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="success" class="mb-3">
                      mdi-calendar-today
                    </v-icon>
                    <div class="text-h6 mb-2">Jour de l'année</div>
                    <div class="text-h4 font-weight-bold">
                      {{ dayOfYear }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="info" class="mb-3">
                      mdi-weather-sunny
                    </v-icon>
                    <div class="text-h6 mb-2">Saison</div>
                    <div class="text-h4 font-weight-bold">
                      {{ currentSeason }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="warning" class="mb-3">
                      mdi-clock-outline
                    </v-icon>
                    <div class="text-h6 mb-2">Fuseau horaire</div>
                    <div class="text-body-1 font-weight-bold">
                      {{ timezone }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="error" class="mb-3">
                      mdi-progress-clock
                    </v-icon>
                    <div class="text-h6 mb-2">Progression du jour</div>
                    <v-progress-linear
                      :model-value="dayProgress"
                      color="primary"
                      height="20"
                      class="mt-3"
                    >
                      <strong>{{ Math.round(dayProgress) }}%</strong>
                    </v-progress-linear>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6" md="4">
                <v-card class="pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="secondary" class="mb-3">
                      mdi-calendar-clock
                    </v-icon>
                    <div class="text-h6 mb-2">Jours restants</div>
                    <div class="text-h4 font-weight-bold">
                      {{ daysLeftInYear }}
                    </div>
                    <div class="text-caption">dans l'année</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, computed } from 'vue'
    import Header from '../components/header.vue'

    const currentTime = ref('')
    const currentDate = ref('')
    const currentDay = ref('')
    const weekNumber = ref(0)
    const dayOfYear = ref(0)
    const currentSeason = ref('')
    const timezone = ref('')
    const dayProgress = ref(0)
    const daysLeftInYear = ref(0)

    let intervalId = null

    const updateDateTime = () => {
	    const now = new Date()

	// ----- Affichages locaux (OK en fr-FR) -----
	currentTime.value = now.toLocaleTimeString('fr-FR', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	currentDate.value = now.toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})

	currentDay.value = now.toLocaleDateString('fr-FR', { weekday: 'long' })
	timezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone

	// ----- Calculs en UTC pour éviter les décalages DST -----
	const MS_PER_DAY = 24 * 60 * 60 * 1000
	const y = now.getUTCFullYear()
	const m = now.getUTCMonth()          // 0-11
	const d = now.getUTCDate()           // 1-31

	// "Aujourd'hui" borné à minuit UTC
	const todayUTC = Date.UTC(y, m, d)

	// Jour de l'année (1..365/366)
	const startOfYearUTC = Date.UTC(y, 0, 1)
	dayOfYear.value = Math.floor((todayUTC - startOfYearUTC) / MS_PER_DAY) + 1

	// Jours restants dans l'année (jusqu'au 31/12 inclus => sans +1)
	const endOfYearUTC = Date.UTC(y, 11, 31)
	daysLeftInYear.value = Math.floor((endOfYearUTC - todayUTC) / MS_PER_DAY)

	// Saison (simple, selon le mois)
	if (m >= 2 && m <= 4) currentSeason.value = 'Printemps'
	else if (m >= 5 && m <= 7) currentSeason.value = 'Été'
	else if (m >= 8 && m <= 10) currentSeason.value = 'Automne'
	else currentSeason.value = 'Hiver'

	// Numéro de semaine ISO-8601 (optionnel mais plus juste)
	weekNumber.value = getISOWeekNumber(now)
}

// ISO-8601 week number (jeudi comme référence)
function getISOWeekNumber(date) {
	const MS_PER_DAY = 24 * 60 * 60 * 1000
	// Date UTC (strip time)
	const utc = new Date(Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate()
	))
	// 0 (dim) -> 7 (dim)
	const dayNum = (utc.getUTCDay() || 7)
	// Aller au jeudi de cette semaine
	utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
	const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
	return Math.ceil(((utc - yearStart) / MS_PER_DAY + 1) / 7)
}


    onMounted(() => {
    updateDateTime()
    intervalId = setInterval(updateDateTime, 1000)
    })

    onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
    })
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-4px);
}
</style>