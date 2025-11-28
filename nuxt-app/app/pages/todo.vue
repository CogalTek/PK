<template>
    <div></div>
</template>

<script setup>
    onMounted(async () => {
        const todo = await $fetch('/api/todo')
    })
</script>

