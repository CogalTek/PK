<template>
    <Header />
    <div>
        <h1>Hello world</h1>
    </div>
</template>

<script setup>
    import Header from '../components/header.vue'
    definePageMeta({
        middleware: ['auth-logged-in'],
    })
</script>