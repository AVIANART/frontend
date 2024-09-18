<script setup lang="ts">
    import CategoryList from '@components/CategoryList.vue';
</script>
<template>
    <suspense>
        <CategoryList />
        <template #fallback>loading...</template>
    </suspense>
</template>