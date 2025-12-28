<template>
	<div class="pa-4">
		<Header />
		<v-container>
			<!-- Header -->
			<div class="d-flex justify-space-between align-center mb-6">
				<div>
					<h1 class="text-h3 font-weight-bold mb-2">Banque</h1>
					<p class="text-subtitle-1 text-medium-emphasis">Gestion des dépenses partagées</p>
				</div>
				<v-btn color="primary" size="large" prepend-icon="mdi-plus" @click="openAddDialog">
					Nouvelle dépense
				</v-btn>
			</div>

			<!-- Balance Summary -->
			<v-row class="mb-6">
				<v-col cols="12" md="4" v-for="user in users" :key="user.id">
					<v-card>
						<v-card-text>
							<div class="d-flex align-center mb-2">
								<v-avatar :color="user.color" size="40" class="mr-3">
									<span class="text-h6">{{ user.name.charAt(0) }}</span>
								</v-avatar>
								<div>
									<div class="text-h6">{{ user.name }}</div>
									<div class="text-caption text-medium-emphasis">Balance</div>
								</div>
							</div>
							<div class="text-h4 mt-2"
								:class="getUserBalance(user.id) >= 0 ? 'text-success' : 'text-error'">
								{{ formatCurrency(getUserBalance(user.id)) }}
							</div>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>

			<!-- Expenses List -->
			<v-card>
				<v-card-title class="d-flex justify-space-between align-center">
					<span>Dépenses récentes</span>
					<v-chip v-if="expenses.length > 0">{{ expenses.length }} dépense(s)</v-chip>
				</v-card-title>
				<v-divider></v-divider>

				<v-list v-if="expenses.length > 0">
					<v-list-item v-for="expense in sortedExpenses" :key="expense.id" class="py-3">
						<template v-slot:prepend>
							<v-avatar :color="getUserById(expense.paidBy)?.color || 'grey'" size="48">
								<span class="text-h6">{{ getUserById(expense.paidBy)?.name.charAt(0) }}</span>
							</v-avatar>
						</template>

						<v-list-item-title class="text-h6 mb-1">
							{{ expense.title }}
						</v-list-item-title>
						<v-list-item-subtitle class="mb-2">
							{{ expense.description }}
						</v-list-item-subtitle>
						<v-list-item-subtitle class="d-flex align-center flex-wrap gap-2">
							<v-chip size="small" variant="tonal">
								<v-icon start size="small">mdi-calendar</v-icon>
								{{ formatDate(expense.date) }}
							</v-chip>
							<v-chip size="small" variant="tonal" color="primary">
								<v-icon start size="small">mdi-cash</v-icon>
								{{ formatCurrency(expense.amount) }}
							</v-chip>
							<v-chip size="small" variant="tonal" color="secondary">
								<v-icon start size="small">mdi-account-multiple</v-icon>
								{{ expense.participants.length }} participant(s)
							</v-chip>
						</v-list-item-subtitle>

						<template v-slot:append>
							<v-btn icon="mdi-delete" variant="text" color="error"
								@click="deleteExpense(expense.id)"></v-btn>
						</template>
					</v-list-item>
				</v-list>

				<v-card-text v-else class="text-center py-12">
					<v-icon size="64" color="grey-lighten-1">mdi-cash-remove</v-icon>
					<p class="text-h6 mt-4 text-medium-emphasis">Aucune dépense enregistrée</p>
					<p class="text-body-2 text-medium-emphasis">Cliquez sur "Nouvelle dépense" pour commencer</p>
				</v-card-text>
			</v-card>

			<!-- Add Expense Dialog -->
			<v-dialog v-model="dialog" max-width="600">
				<v-card>
					<v-card-title class="text-h5">Nouvelle dépense</v-card-title>
					<v-divider></v-divider>

					<v-card-text class="pt-4">
						<v-form ref="form">
							<v-text-field v-model="newExpense.title" label="Titre" prepend-icon="mdi-text"
								:rules="[v => !!v || 'Le titre est requis']" variant="outlined"
								class="mb-3"></v-text-field>

							<v-text-field v-model="newExpense.amount" label="Montant (€)"
								prepend-icon="mdi-currency-eur" type="number" step="0.01"
								:rules="[v => !!v || 'Le montant est requis', v => v > 0 || 'Le montant doit être positif']"
								variant="outlined" class="mb-3"></v-text-field>

							<v-text-field v-model="newExpense.date" label="Date" prepend-icon="mdi-calendar" type="date"
								:rules="[v => !!v || 'La date est requise']" variant="outlined"
								class="mb-3"></v-text-field>

							<v-textarea v-model="newExpense.description" label="Description" prepend-icon="mdi-text-box"
								variant="outlined" rows="3" class="mb-3"></v-textarea>

							<v-select v-model="newExpense.paidBy" :items="users" item-title="name" item-value="id"
								label="Payé par" prepend-icon="mdi-account"
								:rules="[v => !!v || 'Sélectionnez qui a payé']" variant="outlined"
								class="mb-3"></v-select>

							<v-select v-model="newExpense.participants" :items="users" item-title="name" item-value="id"
								label="Participants" prepend-icon="mdi-account-multiple"
								:rules="[v => v.length > 0 || 'Sélectionnez au moins un participant']"
								variant="outlined" multiple chips closable-chips>
								<template v-slot:chip="{ item, props }">
									<v-chip v-bind="props" :color="getUserById(item.value)?.color">
										{{ item.title }}
									</v-chip>
								</template>
							</v-select>
						</v-form>
					</v-card-text>

					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn variant="text" @click="dialog = false">Annuler</v-btn>
						<v-btn color="primary" variant="flat" @click="addExpense">Ajouter</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '../components/header.vue'

definePageMeta({
	middleware: ['auth-logged-in'],
})

// Users list
const users = ref([
	{ id: 1, name: 'Alice', color: 'blue' },
	{ id: 2, name: 'Bob', color: 'green' },
	{ id: 3, name: 'Charlie', color: 'orange' },
	{ id: 4, name: 'Diana', color: 'purple' }
])

// Expenses list
const expenses = ref([])

// Dialog state
const dialog = ref(false)
const form = ref(null)

// New expense form
const newExpense = ref({
	title: '',
	amount: null,
	date: new Date().toISOString().split('T')[0],
	description: '',
	paidBy: null,
	participants: []
})

// Load expenses from localStorage
onMounted(() => {
	const saved = localStorage.getItem('banque-expenses')
	if (saved) {
		expenses.value = JSON.parse(saved)
	}
})

// Save expenses to localStorage
const saveExpenses = () => {
	localStorage.setItem('banque-expenses', JSON.stringify(expenses.value))
}

// Sorted expenses (most recent first)
const sortedExpenses = computed(() => {
	return [...expenses.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Get user by ID
const getUserById = (id) => {
	return users.value.find(u => u.id === id)
}

// Calculate balance for a user
const getUserBalance = (userId) => {
	let balance = 0

	expenses.value.forEach(expense => {
		const amountPerPerson = expense.amount / expense.participants.length

		// If user paid, they get the full amount
		if (expense.paidBy === userId) {
			balance += expense.amount
		}

		// If user is a participant, they owe their share
		if (expense.participants.includes(userId)) {
			balance -= amountPerPerson
		}
	})

	return balance
}

// Format currency
const formatCurrency = (amount) => {
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR'
	}).format(amount)
}

// Format date
const formatDate = (date) => {
	return new Intl.DateTimeFormat('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(new Date(date))
}

// Open add dialog
const openAddDialog = () => {
	newExpense.value = {
		title: '',
		amount: null,
		date: new Date().toISOString().split('T')[0],
		description: '',
		paidBy: null,
		participants: []
	}
	dialog.value = true
}

// Add expense
const addExpense = async () => {
	const { valid } = await form.value.validate()

	if (valid) {
		expenses.value.push({
			id: Date.now(),
			...newExpense.value,
			amount: parseFloat(newExpense.value.amount)
		})

		saveExpenses()
		dialog.value = false
	}
}

// Delete expense
const deleteExpense = (id) => {
	expenses.value = expenses.value.filter(e => e.id !== id)
	saveExpenses()
}
</script>

<style scoped>
.gap-2 {
	gap: 8px;
}
</style>