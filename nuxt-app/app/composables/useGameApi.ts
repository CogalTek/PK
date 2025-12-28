export const useGameApi = () => {
  const handleError = (error: any) => {
    if (error.statusCode === 401) {
      console.error('Not authenticated - redirecting to login')
      navigateTo('/api/login')
      throw new Error('Please log in to continue')
    }
    throw error
  }

  return {
    async fetchGames() {
      try {
        return await $fetch('/api/games')
      } catch (error) {
        handleError(error)
      }
    },

    async createGame(data: any) {
      try {
        return await $fetch('/api/games', {
          method: 'POST',
          body: data
        })
      } catch (error) {
        handleError(error)
      }
    },

    async deleteGame(id: string) {
      try {
        return await $fetch(`/api/games/${id}`, {
          method: 'DELETE'
        })
      } catch (error) {
        handleError(error)
      }
    },

    async fetchServers() {
      try {
        return await $fetch('/api/servers')
      } catch (error) {
        handleError(error)
      }
    },

    async createServer(data: any) {
      try {
        return await $fetch('/api/servers', {
          method: 'POST',
          body: data
        })
      } catch (error) {
        handleError(error)
      }
    },

    async startServer(id: string) {
      try {
        return await $fetch(`/api/servers/${id}/start`, {
          method: 'POST'
        })
      } catch (error) {
        handleError(error)
      }
    },

    async stopServer(id: string) {
      try {
        return await $fetch(`/api/servers/${id}/stop`, {
          method: 'POST'
        })
      } catch (error) {
        handleError(error)
      }
    },

    async deleteServer(id: string) {
      try {
        return await $fetch(`/api/servers/${id}`, {
          method: 'DELETE'
        })
      } catch (error) {
        handleError(error)
      }
    },

    async getServerLogs(id: string) {
      try {
        return await $fetch(`/api/servers/${id}/logs`)
      } catch (error) {
        handleError(error)
      }
    }
  }
}
