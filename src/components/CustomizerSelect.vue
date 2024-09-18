<script setup lang="ts">
    import { Ref, onBeforeUnmount, onMounted, ref } from 'vue';
    import { PropType } from 'vue';
    import { WidgetSelectbox } from '@scripts/types';
    import Choices, { ClassNames } from 'choices.js';
    import 'choices.js/public/assets/styles/choices.min.css';

    const setValue = (newValue: string) => {
        choicesInstance.setChoiceByValue(newValue as string);
        emit('update:value', choicesInstance.getValue(true));
    };

    defineExpose({
        setValue,
    });

    const props = defineProps({
        widget: {
            type: Object as PropType<WidgetSelectbox>,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        inline: {
            type: Boolean,
            default: false,
        }
    });

    const emit = defineEmits(['update:value']);
    const choicesSelect: Ref<HTMLElement | null> = ref(null);
    let choicesInstance: Choices;

    onMounted(() => {
        if(!choicesSelect.value) return;

        choicesInstance = new Choices(choicesSelect.value, {
            searchEnabled: false,
            shouldSort: false,
            itemSelectText: '',
            removeItemButton: false,
            duplicateItemsAllowed: false,
            placeholder: true,
            allowHTML: true,
            classNames: <ClassNames>{
                containerOuter: 'choices text-body d-inline-block m-0 w-50',
                containerInner: 'choices__inner text-start',
                itemChoice: 'choices__item text-center w-100 m-0 pt-2 pb-2 ps-0 pe-0',
                itemSelectable: 'choices__item--selectable',
            }
        });

        let resolvedChoices: { value: string | number, label: string, selected: boolean }[] = [];
        for(let option of props.widget.options) {
            resolvedChoices.push({
                value: option.value,
                label: new String(option.label + ' ').toString(),
                selected: option.value == props.widget.default,
            });
        }

        choicesInstance.setChoices(resolvedChoices, 'value', 'label', true);

        choicesInstance.passedElement.element.addEventListener('change', () => {
            emit('update:value', choicesInstance.getValue(true));
        });
    });

    onBeforeUnmount(() => {
        if(choicesInstance) {
            choicesInstance.destroy();
        }
    });
</script>

<template>
    <div :class="'form-group' + (inline ? ' d-inline-block w-50' : ' d-inline-block w-100')">
        <div class="input-group mb-3 w-100">
            <span :id="name" class="input-group-text pe-10" style="width: 40% !important;">{{ widget.label }}</span>
            <select :id="'select'+name" ref="choicesSelect" :name="name" :aria-describedby="name">
                <option value="-1" class="form-select" disabled selected>Select an available option</option>
            </select>
            <span :id="name+'help'" class="input-group-text"><a href="#" data-bs-toggle="popover" data-bs-html="true" data-bs-trigger="focus" :data-bs-content="widget.help ? '<div class=\'container\'><pre class=\'pb-5 pr-6\'>'+widget.help.join('<br>')+'</pre></div>' : widget.label" @click="(e) => {e.preventDefault(); return false}">?</a></span>
        </div>
    </div>
</template>