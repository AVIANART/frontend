<script setup lang="ts">
    import ChoicesSelect from '@/components/ChoicesSelect.vue';
    import CustomizerOption from '@/components/CustomizerOption.vue';
    import API from '@/scripts/api/api';
    import { CustomizerSetting, GuiTabs, Preset } from '@/scripts/types';
    import { defineStore } from 'pinia';
    import { useRoute } from 'vue-router';
    import { branches } from '@/config.json';
    import { ComponentPublicInstance, Ref, onMounted, ref } from 'vue';
    import { Modal, Toast } from 'bootstrap';
    import { WidgetBase } from '@/scripts/types';

    const route = useRoute();

    const api = new API();
    const branchOptions: { value: string | number, label: string }[] = [];

    for(let branch of branches) {
        branchOptions.push({ value: branch.slug, label: branch.name });
    }

    const useCustomizerStore = defineStore('customizerStore', () => {
        const preset = ref({} as Preset);
        const branch = ref('DRUnstable');
        const settings = ref({} as { [key: string]: { [key: string]: CustomizerSetting } });

        const setPreset = async (newPreset: string) => {
            if(newPreset === 'none') preset.value = <Preset>{};
            else preset.value = await api.getPreset('avianart', newPreset);
        };

        const setBranch = (newBranch: string) => {
            branch.value = newBranch;
        };

        const getSetting = (name: string): CustomizerSetting | null => {
            return settings.value[branch.value][name] ?? null;
        };

        const setSetting = (name: string, value: string | number | boolean) => {
            const setting = getSetting(name);
            if(setting) settings.value[branch.value][name].value = value;
            else settings.value[branch.value][name] = <CustomizerSetting>{ name: name, value: value };
        };

        const initSetting = (name: string, widget: WidgetBase) => {
            if(widget.default !== undefined) {
                if(!settings.value[branch.value]) settings.value[branch.value] = {};
                settings.value[branch.value][name] = <CustomizerSetting>{ name: name, default: widget.default, value: settings.value[branch.value][name] ? settings.value[branch.value][name].value : widget.default };
            } else {
                console.log(`Widget ${name} has no default value, don't init...`);
            }
        };

        return {
            preset,
            branch,
            settings,
            initSetting,
            getSetting,
            setPreset,
            setBranch,
            setSetting
        };
    }, { persist: true });

    const customizer = useCustomizerStore();
    if(route.params.preset) customizer.setPreset(route.params.preset as string);
    else customizer.setPreset('none');

    const tabsRaw = {} as GuiTabs;
    const tabs = ref(tabsRaw.tabs);
    const branchInfo = ref(tabsRaw.meta ?? { version: 'Unknown' });

    const customizerOptions = ref({} as { [key: string]: Element | ComponentPublicInstance | null });

    let messageToast: Ref<Toast | null> = ref(null);
    let messageToastEl: Ref = ref(null);
    let clippyChicken: Ref = ref(null);
    let toastHeader = ref('');
    let toastBody = ref('');

    let modal: Ref<Modal | null> = ref(null);
    let modalEl: Ref = ref(null);
    let modalTitle = ref('');
    let modalBody = ref('');
    let modalCallback: Ref<object | null> = ref(() => {});

    const widgetCommand = (command?: string) => {
        if(command) {
            let smallkeyshuffle = customizerOptions.value['smallkeyshuffle'] as typeof CustomizerOption | null;
            let bow_mode = customizerOptions.value['bow_mode'] as typeof CustomizerOption | null;
            let take_any = customizerOptions.value['take_any'] as typeof CustomizerOption | null;
            let pottery = customizerOptions.value['pottery'] as typeof CustomizerOption | null;
            let dropshuffle = customizerOptions.value['dropshuffle'] as typeof CustomizerOption | null;
            switch(command) {
                case 'retro':
                    if(smallkeyshuffle !== null && bow_mode !== null && take_any !== null) {
                        smallkeyshuffle.setValue('universal');
                        bow_mode.setValue('retro');
                        take_any.setValue('random');
                        spawnToast('Retro Mode Set', 'The following settings were changed:\nSmall Key Shuffle -> Universal\nBow Mode -> Retro (Rupee Bow)\nTake Any Caves -> Enabled, Random Placement');
                    }
                    break;
                case 'keydropshuffle':
                    if(pottery !== null && dropshuffle !== null) {
                        pottery.setValue('keys');
                        dropshuffle.setValue('keys');
                        spawnToast('Key Drop Shuffle Set', 'The following settings were changed:\nPottery -> Keys\nDrop Shuffle -> Keys');
                    }
                    break;
                default:
                    break;
            }
        }
    };

    const changeBranch = async (newBranch: string) => {
        customizer.setBranch(newBranch);
        const newTabs = await api.getGuiTabs(newBranch);
        tabs.value = newTabs.tabs;
        branchInfo.value = newTabs.meta;

        // Init widget settings
        for(let tab in tabs.value) {
            for(let collection in tabs.value[tab].widgets) {
                for(let widget in tabs.value[tab].widgets[collection]) {
                    customizer.initSetting(widget, tabs.value[tab].widgets[collection][widget]);
                }
            }
        }
    };

    const changeSetting = (name: string, value: string | number | boolean) => {
        customizer.setSetting(name, value);
    };

    const resetCustomizer = () => {
        spawnModal('Reset Options', 'Are you sure you want to reset all options to their default values?', () => {
            for(let option in customizerOptions.value) {
                if(customizerOptions.value[option] !== undefined && customizerOptions.value[option] !== null) {
                    (customizerOptions.value[option] as typeof CustomizerOption | null)?.resetValue();
                }
            }
            spawnToast('Options Reset', 'All options have been reset to defaults');
        });
    };

    const spawnToast = (title: string, body: string, timeout: number = 5) => {
        messageToast.value = Toast.getOrCreateInstance(messageToastEl.value as HTMLElement);
        toastHeader.value = title;
        toastBody.value = body;
        messageToast.value?.show();
        clippyChicken.value?.classList.remove('hide');
        setTimeout(() => {
            messageToast.value?.hide();
            clippyChicken.value?.classList.add('hide');
        }, timeout * 1000);
    };

    const spawnModal = (title: string, body: string, callback: object) => {
        modal.value = Modal.getOrCreateInstance(modalEl.value as HTMLElement);
        modalTitle.value = title;
        modalBody.value = body;
        modalCallback.value = callback;
        modal.value?.show();
    };

    onMounted(() => {
        clippyChicken.value = clippyChicken.value as HTMLElement;
        messageToast.value = Toast.getOrCreateInstance(messageToastEl.value as HTMLElement);
        for(let option in customizerOptions.value) {
            if(customizerOptions.value[option] !== undefined && customizerOptions.value[option] !== null) {
                (customizerOptions.value[option] as typeof CustomizerOption | null)?.setValue(customizer.getSetting(option)?.value ?? (customizerOptions.value[option] as typeof CustomizerOption | null)?.widget.default);
            }
        }
    });

    changeBranch(customizer.branch);
</script>

<template>
    <div v-if="customizer.preset.name !== undefined">
        <h2>Customizing {{ customizer.preset.name }}</h2>
    </div>
    <div v-else>
        <h2>Customizer</h2>
    </div>
    <div class="container">
        <ul id="guiTabs" class="nav nav-tabs" role="tablist">
            <li id="guiTab--2">
                <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#guiTabContent--2" type="button" role="tab" aria-controls="-2" aria-selected="true">Generator Settings</button>
            </li>
            <li v-for="(tab, index) in tabs" :id="'guiTab-'+index" :key="index" class="nav-item" role="presentation">
                <template v-if="tab.name !== 'gameoptions' && tab.name !== 'generation' && tab.name !== 'multiworld'">
                    <div class="d-none">{{ tab }}</div>
                    <button class="nav-link" data-bs-toggle="tab" :data-bs-target="'#guiTabContent-'+index" type="button" role="tab" :aria-controls="''+index" aria-selected="false">{{ tab.name.charAt(0).toUpperCase() + tab.name.slice(1).replace("ntrando", "ntrances") }}</button>
                </template>
            </li>
        </ul>
        <div id="avianCategoriesContent" class="tab-content">
            <div id="guiTabContent--2" class="tab-pane fade show active" role="tabpanel" aria-labelledby="guiTab--2">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-12 p-2">
                            <h4>Generator And Presets Settings</h4><p class="fs-6">
                                These settings are specific to the avianart generator, and preset metadata. They are not part of a normal YAML file.
                            </p>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-6 p-2">
                            <div class="input-group">
                                <ChoicesSelect :options="branchOptions" name="Branch" :value="customizer.branch" help="Choose which branch to use. DRUnstable is the default and usually most up-to-date. OWR has the most options." @update:value="changeBranch" />
                            </div>
                            <br>
                            <span>Branch Info: <pre>{{ branchInfo.version }}</pre></span>
                            <button class="btn btn-secondary" @click="resetCustomizer">Reset Options</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(tab, index) in tabs" :id="'guiTabContent-'+index" :key="index" class="tab-pane fade" role="tabpanel" :aria-labelledby="'guiTab-'+index">
                <template v-if="tab.name !== 'gameoptions' && tab.name !== 'generation' && tab.name !== 'multiworld'">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="container">
                                <!-- Top Boxes First -->
                                <div class="row pt-3">
                                    <div class="col-18 pb-2">
                                        <template v-for="(widgets, wsIndex) in tab.keysanity" :key="wsIndex">
                                            <div class="container w-75">
                                                <div class="border-bottom mb-2">
                                                    {{ (wsIndex as string).charAt(0).toUpperCase() + (wsIndex as string).slice(1) }} Options
                                                </div>
                                                <div class="w-100 text-end">
                                                    <template v-for="(widget, wIndex) in widgets" :key="wIndex">
                                                        <CustomizerOption :ref="(el) => ( customizerOptions[wIndex] = el )" :widget="widget" :name="(wIndex as string)" :inline="true" @update:model-value="(val) => changeSetting(wIndex as string, val)" />
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-for="(widgets, wsIndex) of tab.widgets" :key="wsIndex">
                                            <div class="container w-75">
                                                <div v-if="(wsIndex.toString() == 'widgets' && tab.name == 'dungeon')" class="border-bottom mb-2">
                                                    Dungeon Options
                                                </div>
                                                <div class="w-100 text-center">
                                                    <template v-if="wsIndex.toString().includes('checkbox')">
                                                        <template v-for="(widget, wIndex) of widgets" :key="wIndex">
                                                            <CustomizerOption :ref="(el) => ( customizerOptions[wIndex] = el )" :widget="widget" :name="(wIndex as string)" :inline="true" @update:model-value="(val) => changeSetting(wIndex as string, val)" @update:clicked="widgetCommand(widget.config?.command)" />
                                                        </template>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div class="row">
                                    <!-- Left Panes -->
                                    <div class="col">
                                        <template v-for="(widgets, wsIndex) in tab.widgets" :key="wsIndex">
                                            <template v-if="wsIndex.toString().includes('left')">
                                                <div class="col">
                                                    <div v-for="(widget, wIndex) in widgets" :key="wIndex" :class="widget.type === 'checkbox' ? 'w-75 text-start pt-2 pb-3' : ''">
                                                        <CustomizerOption :ref="(el) => ( customizerOptions[wIndex] = el )" :widget="widget" :name="(wIndex as string)" @update:model-value="(val) => changeSetting(wIndex as string, val)" @update:clicked="widgetCommand(widget.config?.command)" />
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                    <!-- Right Panes -->
                                    <div class="col">
                                        <template v-for="(widgets, wsIndex) of tab.widgets" :key="wsIndex">
                                            <template v-if="wsIndex.toString().includes('right')">
                                                <div class="col">
                                                    <div v-for="(widget, wIndex) in widgets" :key="wIndex" :class="widget.type === 'checkbox' ? 'w-75 text-start pb-2' : ''">
                                                        <CustomizerOption :ref="(el) => ( customizerOptions[wIndex] = el )" :widget="widget" :name="(wIndex as string)" @update:model-value="(val) => changeSetting(wIndex as string, val)" @update:clicked="widgetCommand(widget.config?.command)" />
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                </div>
                                <div class="row">
                                    <!-- Bottom Boxes Last -->
                                    <div class="col-3" />
                                    <div class="col-6 justify-content-end">
                                        <template v-for="(widgets, wsIndex) in tab.widgets" :key="wsIndex">
                                            <template v-if="!wsIndex.toString().includes('checkbox') && !wsIndex.toString().includes('left') && !wsIndex.toString().includes('right')">
                                                <div class="col">
                                                    <div v-for="(widget, wIndex) in widgets" :key="wIndex" :class="widget.type === 'checkbox' ? 'w-75 text-start pb-2' : ''">
                                                        <CustomizerOption :ref="(el) => ( customizerOptions[wIndex] = el )" :widget="widget" :name="(wIndex as string)" @update:model-value="(val) => changeSetting(wIndex as string, val)" @update:clicked="widgetCommand(widget.config?.command)" />
                                                    </div>
                                                </div>
                                            </template>
                                        </template>
                                    </div>
                                    <div class="col-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="position-fixed top-0 start-0 p-3" style="z-index: 11">
            <div id="messageToastEl" ref="messageToastEl" class="toast hide ms-office-toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">{{ toastHeader }}</strong>
                    <button type="button" class="btn-close" style="height: 0.5em; width: 0.5em;" data-bs-dismiss="toast" aria-label="Close" />
                </div>
                <div class="toast-body text-start">
                    <pre>{{ toastBody }}</pre>
                </div>
            </div>
            <img id="clippyChicken" ref="clippyChicken" class="hide" src="/images/Chicken.gif" alt="Chicken" style="transform: rotateY(180deg); margin-top: 1em; margin-left: -15em; height: 5em; width: 5em; image-rendering: pixelated">
        </div>
        <div ref="modalEl" class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ modalTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div class="modal-body">
                        <p>{{ modalBody }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Dismiss</button>
                        <button type="button" class="btn btn-danger" @click="() => { modal?.hide(); (modalCallback as Function)();}">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>