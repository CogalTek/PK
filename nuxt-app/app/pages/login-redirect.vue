<template>
    <div>
    </div>
</template>

<script setup lang="ts">
    onMounted(async () => {
        const auth = useState<any>('auth', () => ({}))
        console.log(auth.value.user)
        try {
            const res = await $fetch("/api/auth/upsert-user", {
                method: "POST",
                body: auth.value.user
            })
            if (res.success)
                navigateTo("/home")
        } catch (e) {
            console.error(e)
        }
    })
</script>