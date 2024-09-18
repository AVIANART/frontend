<script setup lang="ts">
    import { defineStore } from 'pinia';
    import { Ref, ref } from 'vue';

    const useUserCustomizationStore = defineStore('userCustomization', () => {
        const theme = ref('avianart');
        const setTheme = (newTheme: string) => {
            theme.value = newTheme;
            document.head.removeChild(themeCss);
            themeCss = document.createElement('link');
            themeCss.rel = 'stylesheet';
            themeCss.href = `/styles/${theme.value}.css`;
            document.head.appendChild(themeCss);
        };
        return {
            theme,
            setTheme,
        };
    }, { persist: true });

    const userCustomization = useUserCustomizationStore();

    let wantsDark = (window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);
    const logo: Ref<HTMLImageElement | null> = ref(null);

    // Apply the desired theme
    let themeCss = document.createElement('link');
    themeCss.rel = 'stylesheet';
    themeCss.href = `/styles/${userCustomization.theme}.css`;
    document.head.appendChild(themeCss);

    // Setup the theme toggle
    const toggleTheme = (isBoring: boolean) => {
        const store = useUserCustomizationStore();
        store.setTheme(isBoring ? 'boring' : 'avianart');
        if(userCustomization.theme === 'boring') {
            wantsDark = (window.matchMedia('(prefers-color-scheme: dark)').matches ? true : false);
            document.documentElement.setAttribute('data-bs-theme', (wantsDark ? 'dark' : 'light'));
        } else {
            wantsDark = false;
            document.documentElement.setAttribute('data-bs-theme', 'light');
        }
        if(logo.value !== null && logo.value instanceof HTMLImageElement)
            logo.value.src = (wantsDark ? '/images/AVIANART-2023-W.png' : '/images/AVIANART-2023.png');
    };

    const styleToggle = defineModel({
        type: Boolean,
        set: (value: boolean) => {
            toggleTheme(value);
            return value;
        },
    });

    styleToggle.value = userCustomization.theme === 'boring';

    const overallStyle = document.createElement('link');
    overallStyle.rel = 'stylesheet';
    overallStyle.href = '/styles/base.css';

    document.head.appendChild(overallStyle);
    if(userCustomization.theme === 'boring') {
        document.documentElement.setAttribute('data-bs-theme', (wantsDark ? 'dark' : 'light'));
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
</script>

<template>
    <div class="align-top text-end m-1">
        <div style="color: white; text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000;">
            <SlideToggle v-model="styleToggle" label="Remove the 90's" :small="true" />
        </div>
    </div>
    <header>
        <div class="container">
            <div class="col">
                <div class="row" />
                <div class="row-lg">
                    <router-link to="/" class="av_link" style="width: 379px;"><img id="logo" ref="logo" :src="wantsDark ? '/images/AVIANART-2023-W.png' : '/images/AVIANART-2023.png'" height="200"></router-link><br>
                </div>
                <div class="row" />
            </div>
        </div>
    </header>
    <main>
        <suspense>
            <RouterView />
        </suspense>
    </main>
    <footer>
        <span id="footerText">
            Tournament concept by <a href="https://www.twitch.tv/structuralmike">StructuralMike</a> &amp; <a href="https://www.twitch.tv/homemadebeer">homemadebeer</a><br>
            Using <a href="https://alttpr.com/" target="_blank">ALTTPR VT</a>, <a href="https://github.com/aerinon/ALttPDoorRandomizer/tree/DoorDevUnstable" target="_blank">Door Randomizer</a> & <a href="https://github.com/codemann8/ALttPDoorRandomizer/tree/OverworldShuffle" target="_blank">Overworld Randomizer</a><br>
            ROM Patcher based on LttP Adjuster and Patcher by <a href="https://www.twitch.tv/kyong92">Kyong</a><br>
            Which is based on <a href="https://www.marcrobledo.com/RomPatcher.js/">Rom Patcher JS</a> <small>v2.4</small> by <a href="https://www.marcrobledo.com/">Marc Robledo</a>
        </span>
    </footer>
</template>

<style scoped>

</style>
