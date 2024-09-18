<script setup lang="ts">
    import { Preset } from '@scripts/types';
    import { computed, PropType } from 'vue';

    const props = defineProps({
        preset: {
            type: Object as PropType<Preset>,
            required: true,
        }
    });

    const canCustomize = computed(() => {
        switch(props.preset.branch) {
            case 'DR':
            case 'DRUnstable':
            case 'OWR':
            case 'OWRDev':
            case 'Kara':
                return true;
            default:
                return false;
        }
    });
</script>

<template>
    <div class="card h-100">
        <div class="card-body">
            <h4 class="card-title">{{ preset.name }}</h4>
            <div class="card-text">
                <div v-if="preset.description.length < 150">
                    <!-- eslint-disable vue/no-v-html -->
                    <p v-if="preset.description.includes('<') && preset.description.includes('>')" v-html="preset.description" />
                    <p v-else>{{ preset.description }}</p>
                </div>
                <div v-else>
                    <button class="btn btn-primary btn-sm" data-bs-toggle="collapse" type="button" :data-bs-target="'#presetInfo-'+preset.slug" aria-expanded="false" :aria-controls="'presetInfo-'+preset.slug">Show/Hide Description</button>
                    <div :id="'presetInfo-'+preset.slug" class="collapse">
                        <p v-if="preset.description.includes('<') && preset.description.includes('>')" v-html="preset.description" />
                        <p v-else>{{ preset.description }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <router-link :to="'/generate/' + preset.slug" class="btn btn-primary align-bottom">Generate</router-link> <router-link v-if="canCustomize" :to="'/customize/' + preset.slug" class="btn btn-secondary align-bottom">Customize</router-link>
        </div>
    </div>
</template>@/scripts/api/avianTypes