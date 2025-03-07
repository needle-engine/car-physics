import { get, writable } from "svelte/store";
import type { Object3D } from "three";

export type Gamestate = "loading" | "main-menu" | "track-selection" | "car-selection" | "race-idle" | "race-in-progress" | "race-finished" | "race-menu";

/**
 * The state of the game
 */
export const gamestate = writable<Gamestate>("loading");
gamestate.subscribe(state => console.debug("[Gamestate]", state));

export const menuOpen = writable<boolean>(false);



export type Settings = {
    postprocessing: boolean,
    musicVolume: number,
}

let _settingsready = false;
export const settings = writable<Settings>({ postprocessing: true, musicVolume: 1 });
settings.subscribe(new_settings => {
    if (_settingsready && typeof window !== "undefined") {
        console.debug("Saving settings", new_settings);
        localStorage.setItem("settings", JSON.stringify(new_settings));
    }
})
if (typeof window !== "undefined") {
    try {
        const stored = localStorage.getItem("settings");
        if (stored) {
            settings.set(JSON.parse(stored));
        }
    }
    catch (ex) {
        console.error("Failed to load settings", ex);
    }
}
_settingsready = true;

export function updateSettings(new_settings: Partial<Settings>) {
    const existing = get(settings);
    settings.set({ ...existing, ...new_settings });
}






export type GameOption = {
    name: string;
    thumbnail: string | null;
    select: () => Promise<any>;
}
/**
 * Level menu options
 */
export const tracks = writable<GameOption[]>([]);



export type MenuOption = {
    category?: string,
    label: string,
    icon_name?: string,
    onclick: () => void,
    visible: typeof writable<boolean>,
}
export const menuOptions = writable<MenuOption[]>([]);
export function addMenuOption(option: MenuOption) {
    const current = get(menuOptions);
    menuOptions.set([...current, option]);
}



/**
 * The currently player controlled car instance in the world
 */
export const currentCarInstance = writable<Object3D | null>(null);

/**
 * Counting down when the race is about to start
 */
export const currentRaceStartCountDown = writable<number>(0);

/**
 * The current speed of the car in km/h
 */
export const currentCarSpeed = writable<number>(0);

declare type RaceTiming = {
    currentLapTime: number,
    bestLapTime: number,
    lastLapTime: number,
    checkpointTime: number,
    allCheckpointTimes: number[],
}

export const currentRaceTimings = writable<RaceTiming | null>(null);

