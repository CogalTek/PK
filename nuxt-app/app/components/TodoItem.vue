<template>
	<v-card class="todo-item mb-3 rounded-lg" :class="{ 'todo-completed': todo_item?.status || false }" elevation="3"
		style="background-color: #2a2a2a;">
		<v-list-item class="px-4 py-3">
			<template v-slot:prepend>
				<v-checkbox :v-model="todo_item?.status" @click="toggleStatus" hide-details
					class="todo-checkbox">
					<template v-slot:input="{ isActive }">
						<div class="custom-checkbox" :class="{ 'checked': todo_item?.status || false }">
							<Icon v-if="todo_item?.status || false" name="mdi:check" size="16" style="color: white;" />
						</div>
					</template>
				</v-checkbox>
			</template>

	<v-list-item-title class="todo-title" :class="{ 'text-decoration-line-through': todo_item?.status || false }"
		:style="{ color: todo_item?.status ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)' }">
		{{ todo_item?.name || "" }}
	</v-list-item-title>			<template v-slot:append>
				<v-btn variant="tonal" icon size="small" @click="deleteTodo" title="Supprimer la tâche"
					class="delete-btn" style="background-color: rgba(239, 68, 68, 0.15);">
					<Icon name="mdi:trash-can-outline" size="20" style="color: #ef4444;" />
				</v-btn>
			</template>
		</v-list-item>
	</v-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Déclare les props que ce composant recevra
const props = defineProps({
	todo: {
		type: Object,
		required: true,
		// Validation simple pour s'assurer que l'objet a au moins un id et un nom
		validator: (value) => value.id && value.name !== undefined && value.status !== undefined
	}
});

const todo_item = ref(null)

onMounted(() => {
	todo_item.value = props.todo
	console.log(todo_item.value.status)
})

async function handleUpdateTodo() {
	try {
		const res = await $fetch(`/api/todo/${todo_item.value.id}`, {
			method: "PATCH",
			body: {
				status: todo_item.value.status
			}
		})
		console.log(res)
	} catch (e) {
		console.error("Erreur lors de la mise à jour du statut de la tâche:", e)
	}
}

// Déclare les événements que ce composant peut émettre
const emit = defineEmits(['delete-todo']);

// Fonction pour basculer le statut de la tâche (terminée/en cours)
const toggleStatus = () => {
	todo_item.value.status = !todo_item.value.status
	handleUpdateTodo()
};

// Fonction pour supprimer la tâche
const deleteTodo = () => {
	// Émet un événement avec l'ID de la tâche à supprimer
	// Le composant parent sera responsable de l'appel API
	emit('delete-todo', props.todo.id);
};
</script>

<style scoped>
.todo-item {
	transition: all 0.3s ease;
	border-left: 4px solid transparent;
	position: relative;
	overflow: hidden;
}

.todo-item:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4) !important;
	border-left-color: rgba(255, 255, 255, 0.6);
}

.todo-completed {
	background-color: rgba(0, 0, 0, 0.3) !important;
	border-left-color: rgba(255, 255, 255, 0.2);
}

.todo-completed:hover {
	border-left-color: rgba(255, 255, 255, 0.3);
}

.todo-title {
	font-size: 1.05rem;
	line-height: 1.6;
	padding: 0 8px;
	font-weight: 500;
}

.todo-checkbox {
	margin-right: 12px;
}

.custom-checkbox {
	width: 20px;
	height: 20px;
	border: 2px solid rgba(255, 255, 255, 0.4);
	border-radius: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	background-color: transparent;
}

.custom-checkbox:hover {
	border-color: rgba(255, 255, 255, 0.7);
}

.custom-checkbox.checked {
	background-color: #ef4444;
	border-color: #ef4444;
}

.delete-btn {
	opacity: 0.5;
	transition: opacity 0.2s ease;
}

.delete-btn:hover {
	opacity: 1;
	background-color: rgba(239, 68, 68, 0.3) !important;
}
</style>
