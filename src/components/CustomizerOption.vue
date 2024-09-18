<script setup lang="ts">
    import { PropType, Ref, onMounted, ref } from 'vue';
    import { Popover, Tooltip } from 'bootstrap';
    import SlideToggle from './SlideToggle.vue';
    import { WidgetBase, WidgetSelectbox } from '@/scripts/types';
    import CustomizerSelect from './CustomizerSelect.vue';

    const optionElement: Ref<typeof CustomizerSelect | typeof SlideToggle | null> = ref(null);

    const setValue = (value: string | number | boolean) => {
        if(optionElement.value) {
            if(optionElement.value.setValue == undefined)
                optionElement.value.checked = value as boolean;
            else
                optionElement.value.setValue(value as string);
        }
    };

    const resetValue = () => {
        if(optionElement.value) {
            if(optionElement.value.setValue == undefined)
                optionElement.value.checked = props.widget.default as boolean;
            else
                optionElement.value.setValue(props.widget.default as string);
        }
    };

    const handleClick = (value: boolean) => {
        emits('update:modelValue', value);
        if(value) {
            // Command handler for keydrop
            emits('update:clicked', value);
        }
    };

    const handleUpdate = (value: string) => {
        emits('update:modelValue', value);
    };

    defineExpose({
        widget: {
            type: Object as PropType<WidgetBase>,
            required: true,
        },
        setValue,
        resetValue
    });

    const props = defineProps({
        widget: {
            type: Object as PropType<WidgetBase>,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    });

    const emits = defineEmits(['update:updateValue', 'update:modelValue', 'update:clicked']);

    onMounted(() => {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new Popover(popoverTriggerEl);
        });
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        });
    });
</script>

<template>
    <template v-if="widget.type === 'checkbox'">
        <div :class="'form-check' + (inline ? ' d-inline p-2' : '')" data-bs-toggle="tooltip" :title="widget.help ? widget.help.join('\n') : widget.label" role="button">
            <SlideToggle ref="optionElement" :label="widget.label" :small="true" @update:model-value="handleClick" />
        </div>
    </template>
    <template v-else-if="widget.type === 'selectbox'">
        <CustomizerSelect ref="optionElement" :widget="(widget as WidgetSelectbox)" :name="name" :inline="inline" @update:value="handleUpdate" />
    </template>
    <template v-else-if="widget.type === 'button'">
        <div :class="'input-group pb-4 pt-2' + (inline ? ' d-inline p-2' : '')">
            <button :id="name" ref="optionElement" class="btn btn-secondary btn-sm" :name="name" @update:model-value="handleClick" @click="emits('update:clicked')">{{ widget.label }}</button>
        </div>
    </template>
</template>