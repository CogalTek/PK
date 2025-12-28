<template>
  <Header />
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-toolbar :elevation="4" class="rounded mb-4 px-4" style="background-color: #1a1a1a;">
          <Icon name="mdi:server-network" style="color: white;" size="36" class="mr-2" />
          <span class="font-weight-bold mr-4 text-white" style="font-size: 1.3rem;">Game Server Manager</span>
          <v-spacer />
          <v-chip variant="elevated" class="mr-2 font-weight-bold" style="background-color: rgba(76, 175, 80, 0.2); color: #4CAF50;">
            {{ games.length }} {{ games.length > 1 ? 'jeux' : 'jeu' }}
          </v-chip>
          <v-chip variant="elevated" class="font-weight-bold" style="background-color: rgba(33, 150, 243, 0.2); color: #2196F3;">
            {{ servers.length }} {{ servers.length > 1 ? 'serveurs' : 'serveur' }}
          </v-chip>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-tabs v-model="tab" color="primary">
          <v-tab value="games">
            <Icon name="mdi:gamepad-variant" class="mr-2" />
            Games
          </v-tab>
          <v-tab value="servers">
            <Icon name="mdi:server" class="mr-2" />
            Servers
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-window v-model="tab">
      <!-- Games Tab -->
      <v-window-item value="games">
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateGameDialog = true">
              Add New Game
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="game in games" :key="game.id" cols="12" md="6" lg="4">
            <GameCard
              :game="game"
              @create-server="createServerFromGame"
              @delete="deleteGame"
            />
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Servers Tab -->
      <v-window-item value="servers">
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateServerDialog = true">
              Add New Server
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="server in servers" :key="server.id" cols="12" md="6" lg="4">
            <ServerCard
              :server="server"
              :loading="loading[server.id]"
              @start="startServer"
              @stop="stopServer"
              @show-logs="showLogs"
              @delete="deleteServer"
            />
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>

    <!-- Create Game Dialog -->
    <CreateGameDialog
      v-model="showCreateGameDialog"
      @submit="createGame"
    />

    <!-- Create Server Dialog -->
    <CreateServerDialog
      ref="createServerDialogRef"
      v-model="showCreateServerDialog"
      :games="games"
      @submit="createServer"
    />

    <!-- Logs Dialog -->
    <ServerLogsDialog
      v-model="showLogsDialog"
      :logs="currentLogs"
    />

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import Header from '../components/header.vue';

const auth = useState<any>('auth', () => ({}))
const tab = ref('games');
const games = ref<any[]>([]);
const servers = ref<any[]>([]);
const loading = ref<{ [key: string]: boolean }>({});

const showCreateGameDialog = ref(false);
const showCreateServerDialog = ref(false);
const showLogsDialog = ref(false);
const currentLogs = ref('');
const createServerDialogRef = ref<any>(null);

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
});

// Load games and servers
async function loadGames() {
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    const data = await $fetch('/api/games', {
      query: { userId: auth.value.user.id }
    });
    games.value = data as any[];
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to load games', 'error');
  }
}

async function loadServers() {
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    const data = await $fetch('/api/servers', {
      query: { userId: auth.value.user.id }
    });
    servers.value = data as any[];
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to load servers', 'error');
  }
}

// Create game
async function createGame(data: any) {
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    await $fetch('/api/games', {
      method: 'POST',
      body: {
        ...data,
        userId: auth.value.user.id
      },
    });

    showSnackbar('Game created successfully', 'success');
    await loadGames();
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to create game', 'error');
  }
}

// Delete game
async function deleteGame(id: string) {
  if (!confirm('Are you sure you want to delete this game?')) return;

  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    await $fetch(`/api/games/${id}`, { 
      method: 'DELETE',
      query: { userId: auth.value.user.id }
    });
    showSnackbar('Game deleted successfully', 'success');
    await loadGames();
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to delete game', 'error');
  }
}

// Create server
async function createServer(data: { gameId: string; name: string }) {
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    await $fetch('/api/servers', {
      method: 'POST',
      body: {
        ...data,
        userId: auth.value.user.id
      },
    });

    showSnackbar('Server created successfully', 'success');
    await loadServers();
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to create server', 'error');
  }
}

// Create server from game
function createServerFromGame(game: any) {
  if (createServerDialogRef.value) {
    createServerDialogRef.value.prefillForm(game.id, `${game.name} Server`);
  }
  showCreateServerDialog.value = true;
}

// Start server
async function startServer(id: string) {
  loading.value[id] = true;
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    await $fetch(`/api/servers/${id}/start`, { 
      method: 'POST',
      query: { userId: auth.value.user.id }
    });
    showSnackbar('Server started successfully', 'success');
    await loadServers();
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to start server', 'error');
  } finally {
    loading.value[id] = false;
  }
}

// Stop server
async function stopServer(id: string) {
  loading.value[id] = true;
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    await $fetch(`/api/servers/${id}/stop`, { 
      method: 'POST',
      query: { userId: auth.value.user.id }
    });
    showSnackbar('Server stopped successfully', 'success');
    await loadServers();
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to stop server', 'error');
  } finally {
    loading.value[id] = false;
  }
}

// Delete server
async function deleteServer(id: string) {
  if (!confirm('Are you sure you want to delete this server?')) return;

  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    await $fetch(`/api/servers/${id}`, { 
      method: 'DELETE',
      query: { userId: auth.value.user.id }
    });
    showSnackbar('Server deleted successfully', 'success');
    await loadServers();
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to delete server', 'error');
  }
}

// Show logs
async function showLogs(id: string) {
  try {
    if (!auth.value.user?.id) {
      showSnackbar('Please login first', 'error');
      return;
    }
    const data: any = await $fetch(`/api/servers/${id}/logs`, {
      query: { userId: auth.value.user.id }
    });
    currentLogs.value = data.logs || 'No logs available';
    showLogsDialog.value = true;
  } catch (error: any) {
    showSnackbar(error.data?.message || 'Failed to fetch logs', 'error');
  }
}

// Show snackbar
function showSnackbar(message: string, color: string) {
  snackbar.value = { show: true, message, color };
}

// Load data on mount
onMounted(() => {
  loadGames();
  loadServers();
});
</script>
