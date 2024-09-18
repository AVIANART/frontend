import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';

// @ts-expect-error The types aren't updated in this package
import timeago from 'vue-timeago3';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'nouislider';
import 'nouislider/dist/nouislider.css';
import '/styles/base.css?url';

// Init Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

// Init Routing
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', name: 'Home', component: () => import('@views/HomeView.vue') },
        { path: '/generate', name: 'Generate', component: () => import('@views/GenerateView.vue') },
        { path: '/generate/:mode', name: 'Generate Mode', component: () => import('@views/GenerateView.vue') },
        { path: '/mmmm', name: 'MMMM', component: () => import('@views/MMMMView.vue') },
        { path: '/perm/:hash', name: 'Permlink', component: () => import('@views/PermlinkView.vue') },
        { path: '/customize', name: 'Customizer', component: () => import('@views/CustomizerView.vue') },
        { path: '/customize/:preset', name: 'Customize Preset', component: () => import('@views/CustomizerView.vue') },
        { path: '/:pathMatch(.*)*', component: () => import('@views/NotFound.vue') }
    ]
});

createApp(App)
    // Plugins
    .use(pinia)
    .use(router)
    .use(timeago)
    // Mount
    .mount('#app');

import 'bootstrap';