<script setup lang="ts">
    defineProps({
        label: {
            type: String,
            required: true,
            default: 'SlideToggle',
        },
        small: {
            type: Boolean,
            default: false,
        }
    });

    const setValue = (value: boolean) => {
        checked.value = value;
    };

    defineExpose({
        setValue,
    });

    const checked = defineModel<boolean>();
</script>

<template>
    <label :class="small ? 'switchSmall' : 'switch'" role="button" :for="label.toLocaleLowerCase()">
        <input :id="label.toLocaleLowerCase()" v-model="checked" type="checkbox">
        <span :class="(small ? 'sliderSmall' : 'slider') + ' round'" />
    </label> <div class="align-text-top d-inline-block" role="button" @click="checked=!checked">{{ label }}</div>
</template>