<template>
    <Header />
    <div>
        <!-- Barre Tâches -->
        <v-toolbar :elevation="4" class="rounded mb-4 px-4" style="background-color: #1a1a1a;">
            <Icon name="mdi:clipboard-check-multiple-outline" style="color: white;" size="36" class="mr-2" />
            <span class="font-weight-bold mr-4 text-white" style="font-size: 1.3rem;">Mes tâches</span>
            <v-spacer />
            <v-chip variant="elevated" class="mr-2 font-weight-bold" style="background-color: rgba(255, 255, 255, 0.15); color: white;">
                {{ todos.length }} {{ todos.length > 1 ? 'tâches' : 'tâche' }}
            </v-chip>
        </v-toolbar>

        <!-- Formulaire création tâche -->
        <create_todo @update="fetchTodos" />

        <!-- Liste des tâches -->
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <v-list v-if="todos.length > 0" class="py-0">
                        <TodoItem 
                            v-for="todo in todos" 
                            :key="todo.id" 
                            :todo="todo" 
                            @delete-todo="handleDeleteTodo"
                        />
                    </v-list>
                    
                    <v-card v-else elevation="2" class="pa-8 text-center" style="background-color: #2a2a2a;">
                        <Icon name="mdi:checkbox-marked-circle-outline" size="64" style="color: rgba(255, 255, 255, 0.2);" class="mb-4" />
                        <v-card-title class="text-h5 mb-2" style="color: rgba(255, 255, 255, 0.7);">Aucune tâche pour le moment</v-card-title>
                        <v-card-subtitle style="color: rgba(255, 255, 255, 0.5);">
                            Ajoutez une nouvelle tâche ci-dessus pour commencer
                        </v-card-subtitle>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue' // Assurez-vous d'importer ref et onMounted
    import Header from '../components/header.vue'
    import create_todo from '~/components/create_todo.vue'
    import TodoItem from '~/components/TodoItem.vue' // Importez le nouveau composant

    const auth = useState('auth', () => ({}))
    const todos = ref([])

    async function fetchTodos() {
        if (!auth.value.user || !auth.value.user.id) {
            console.error("L'ID de l'utilisateur n'est pas disponible.")
            return
        }
        
        try {
            const response = await $fetch(`/api/todo/getTodos?userId=${auth.value.user.id}`)
            if (response && Array.isArray(response.todo)) {
                todos.value = response.todo
            }
        } catch (e) {
            console.error("Erreur lors de la récupération des todos:", e)
        }
    }

    // Gérer l'événement 'delete-todo' du composant TodoItem
    async function handleDeleteTodo(todoId) {
        try {
            await $fetch(`/api/todo/${todoId}`, { // Adaptez l'URL de votre API
                method: "DELETE"
            })
            // Après la suppression, rafraîchissez la liste
            await fetchTodos() 
        } catch (e) {
            console.error("Erreur lors de la suppression de la tâche:", e)
        }
    }

    onMounted(() => {
        fetchTodos()
    })
</script>