export type Preset = {
    name: string
    description: string
    branch: string
    slug: string
    category: string
    data?: string
};

export type RawPreset = {
    Key: string
    LastModified: string
    ETag: string
    Size: string
    StorageClass: string
};



export type WidgetConfig = {
    padx?: [number, number]
    pady?: [number, number]
    command?: string
};

export interface WidgetSpinbox extends WidgetBase {
    type: 'spinbox'
    min: number
    max: number
    step: number
}

export interface WidgetCheckbox extends WidgetBase {
    type: 'checkbox'
}

export interface WidgetButton extends WidgetBase {
    type: 'button'
}

export type WidgetSelectboxOption = {
    value: string | number
    label: string
};
export interface WidgetSelectbox extends WidgetBase {
    type: 'selectbox'
    default: string | number
    options: WidgetSelectboxOption[]
}

export interface WidgetBase {
    type: WidgetType
    label: string
    default: string | number | boolean
    help: string[]
    config: WidgetConfig
}

export type WidgetType = 'button' | 'selectbox' | 'checkbox' | 'spinbox';

export type WidgetCollection = {
    [key: string]: WidgetBase
};

export type WidgetFrame = {
    [key: string]: WidgetCollection
};

export type Tab = {
    name: string
} & {
    [key: string]: WidgetFrame
};

export type Tabs = {
    [key: string]: Tab
};

export interface GuiTabs {
    tabs: Tabs
    meta: {
        branch: string
        version: string
    }
}

export interface CustomizerSetting {
    name: string
    default: string | boolean | number
    value: string | boolean | number | string[] | number[]
}

export interface ILogger {
    trace(message: unknown, ...additional: unknown[]): void
    debug(message: unknown, ...additional: unknown[]): void
    info(message: unknown, ...additional: unknown[]): void
    warn(message: unknown, ...additional: unknown[]): void
    fatal(message: unknown, ...additional: unknown[]): void
}

export type PresetMeta = {
    algorithm?: string
    players?: number
    race?: number
    seed?: number
    user_notes?: string
    type?: string
    category?: string
    /** @deprecated  **/
    enemized?: boolean
    /** @deprecated  **/
    seed_name?: string
    /** @deprecated  **/
    seed_notes?: string
};

export type PresetBoss = 'Armos Knights' | 'Lanmolas' | 'Moldorm' | 'Helmasaur King' | 'Arrghus' | 'Mothula' | 'Blind' | 'Kholdstare' | 'Vitreous' | 'Trinexx';

export type PresetBosses = {
    'Desert Palace': PresetBoss
    'Eastern Palace': PresetBoss
    'Ganons Tower (bottom)': PresetBoss
    'Ganons Tower (middle)': PresetBoss
    'Ganons Tower (top)': PresetBoss
    'Ice Palace': PresetBoss
    'Misery Mire': PresetBoss
    'Palace of Darkness': PresetBoss
    'Skull Woods': PresetBoss
    'Swamp Palace': PresetBoss
    'Thieves Town': PresetBoss
    'Tower of Hera': PresetBoss
    'Turtle Rock': PresetBoss
};

export type PresetYaml = {
    meta?: PresetMeta
    settings?: []
    item_pool?: []
    placements?: []
    advanced_placements?: []
    entrances?: []
    doors?: []
    medallions?: []
    bosses?: PresetBosses[]
    start_inventory?: []
    drops?: []
};