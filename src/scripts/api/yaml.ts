import { Logging } from '../logging';
import { CustomizerSetting } from '../types';
import { parse } from 'yaml';
export default class PresetLibrary extends Logging {
    rawPreset: string;
    settings: CustomizerSetting[] = [];
    constructor(presetData: string) {
        super();
        this.rawPreset = presetData;
        try {
            const yaml = parse(presetData);
            this.settings = yaml.settings;
        } catch (e) {
            this.warn('Failed to parse preset data', e);
        }
    }

    public mergeSettings(settings: CustomizerSetting[]) {
        for(const setting of settings) {
            const index = this.settings.findIndex(s => s.name === setting.name);
            if(index !== -1) {
                this.trace(`Setting ${setting.name} already exists, updating value`);
                this.settings[index] = setting;
            } else {
                this.settings.push(setting);
            }
        }
        this.upgradeSettings();
        return this.settings;
    }

    private upgradeSettings() {
        let needConvertNotes = false;
        let convertName = '';
        let convertNotes = '';
        for(const setting of this.settings) {
            if(setting.name === 'seed_name') {
                needConvertNotes = true;
                convertName = setting.value as string;
            }
            if(setting.name === 'seed_notes') {
                needConvertNotes = true;
                convertNotes = setting.value as string;
            }
            if(setting.name === 'branch') {
                switch(setting.value) {
                    case 'DRVolatile':
                    case 'DRUnstable':
                        this.trace('Updating branch to DRUnstable, was ' + setting.value);
                        setting.value = 'DRUnstable';
                        break;
                    case 'OWR':
                        setting.value = 'OWR';
                        break;
                    case 'OWRDev':
                        setting.value = 'OWRDev';
                        break;
                    case 'Troll':
                        setting.value = 'Troll';
                        break;
                    default:
                        this.trace('Leaving branch as ' + setting.value);
                        // Do nothing
                }
            }
        }

        if(needConvertNotes) {
            this.trace('Converting seed_name and seed_notes to user_notes');
            this.settings.push(<CustomizerSetting>{ name: 'user_notes', value: `${convertName}||${convertNotes}` });
        }
    }
}