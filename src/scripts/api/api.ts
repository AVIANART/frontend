import { Logging } from '../logging';
import { GuiTabs, Preset, RawPreset, Tabs } from '../types';

const isDev = import.meta.env.DEV;
export default class API extends Logging {
    apiUrl: string;
    constructor() {
        super();
        if(isDev) {
            this.apiUrl = 'http://api.avianart.games/v1/';
            this.debug('Using development API');
        } else {
            this.apiUrl = 'https://api.avianart.games/v1/';
            this.debug('Using production API');
        }
    }

    public async getGuiTabs(branch: string = 'DRUnstable') {
        const tabs = await this.call('tabs/' + branch) as GuiTabs;
        const finalResult: GuiTabs = <GuiTabs>{};
        const orderedTabs: Tabs = <Tabs>{};
        const tabOrder = [
            'item',
            'overworld',
            'entrando',
            'dungeon',
            'enemizer',
            'gameoptions',
            'generation'
        ];
        for(const tab in tabs.tabs) {
            orderedTabs[tabOrder.indexOf(tab)] = tabs.tabs[tab];
            orderedTabs[tabOrder.indexOf(tab)].name = tab;
            this.trace('Tab: ' + tab + ' at index ' + tabOrder.indexOf(tab));
        }
        finalResult.tabs = orderedTabs;
        finalResult.meta = tabs.meta;
        this.trace(`Meta: ${JSON.stringify(finalResult.meta)}`);
        return finalResult;
    }

    public async getPreset(namespace: string = 'avianart', preset: string): Promise<Preset> {
        const presetData = await this.call('preset/' + namespace + '/' + preset) as { preset: Preset };
        return presetData.preset;
    }

    public async getPresets(namespace: string = 'avianart'): Promise<Preset[]> {
        const presets: Preset[] = [];
        if(namespace === 'avianart') {
            this.debug('Fetching AvianArt presets');
            const response = await this.call('presets/avianart') as { presets: Preset[] };
            return response.presets;
        }

        try {
            this.debug('Fetching presets for namespace: ' + namespace);
            const response = await this.call('presets/' + namespace) as { presets: RawPreset[] };
            for(const preset in response.presets) {
                const presetData = await this.call('preset/' + response.presets[preset].Key.replace('.yaml', '')) as { preset: Preset };
                presets.push(presetData.preset);
            }
        } catch (error) {
            this.fatal('Failed to fetch presets: ', error);
            throw new Error('Failed to fetch presets: ' + error);
        }
        return presets;
    }

    private async call(method: string): Promise<object> {
        try {
            this.trace('Fetching data from: ' + this.apiUrl + method);
            const rawRes = await fetch(this.apiUrl + method);
            if(rawRes.ok) {
                try {
                    this.trace('Got response: ' + rawRes.statusText);
                    const response = await rawRes.json();
                    return response;
                } catch (error) {
                    this.fatal('Failed to parse response: ', error);
                    throw new Error('Failed to parse response: ' + error);
                }
            }
            this.fatal('Failed to fetch data: ', rawRes.statusText, rawRes.status, await rawRes.text());
            throw new Error('Failed to fetch data: ' + rawRes.statusText);
        } catch (error) {
            this.fatal('Failed to fetch data: ', error);
            throw new Error('Failed to fetch data: ' + error);
        }
    }
}