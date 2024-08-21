<template>
    <div class="flex justify-between mb-8 mt-4">
        <h1 class="lg:text-3xl font-semibold">{{ title }}</h1>
        
    </div>
</template>

<script lang="ts" setup>
defineProps({
    title: String,
})
</script>