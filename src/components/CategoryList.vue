<script setup lang="ts">
    import API from '@/scripts/api/api';
    import { Preset } from '@/scripts/types';

    const api = new API();
    const presetsList = await api.getPresets();
    const categories: Map<string, string> = new Map();
    const config = await import ('@/config.json');
    for(let category of config.categories) {
        categories.set(category.slug, category.name);
    }
    const presets: Map<string, Preset[]> = new Map();
    for(let preset of presetsList) {
        if(categories.has(preset.category)) {
            presets.set(preset.category, presets.get(preset.category)?.concat(preset) || [preset]);
        } else {
            presets.set('uncategorized', presets.get('uncategorized')?.concat(preset) || [preset]);
        }
    }
</script>

<template>
    <div class="container">
        <h2>Generate a preset!</h2>
        <ul id="avianCategories" class="nav nav-tabs" role="tablist">
            <li v-for="(category, index) in categories" :id="'avianCategoryTab-'+category[0]" :key="category[0]" class="nav-item" role="presentation">
                <button :class="'nav-link' + ((index==0) ? ' active' : '')" data-bs-toggle="tab" :data-bs-target="'#avianCategoryContent-'+category[0]" type="button" role="tab" :aria-controls="category[0]" :aria-selected="((index==0) ? true : false)">{{ category[1] }}</button>
            </li>
        </ul>
        <div id="avianCategoriesContent" class="tab-content">
            <div v-for="(category, index) in categories" :id="'avianCategoryContent-'+category[0]" :key="category[0]" :class="'tab-pane fade' + ((index==0) ? ' show active' : '')" role="tabpanel" aria-labelledby="home-tab">
                <div class="grid">
                    <div class="row justify-content-center">
                        <div v-for="preset in presets.get(category[0])" :key="preset.slug" class="col-3 p-2">
                            <PresetMode :preset="preset" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>@/scripts/api/avianTypes