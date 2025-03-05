import { writable } from "svelte/store";
import type { Object3D } from "three";

export type Gamestate = "loading" | "main-menu" | "track-selection" | "car-selection" | "race-idle" | "race-in-progress" | "race-finished";

/**
 * The state of the game
 */
export const gamestate = writable<Gamestate>("loading");
gamestate.subscribe(state => console.debug("[Gamestate]", state));

export type GameOption = {
    name: string;
    thumbnail: string | null;
    select: () => Promise<any>;
}
/**
 * Level menu options
 */
export const gameoptions = writable<GameOption[]>([]);


/**
 * The currently player controlled car instance in the world
 */
export const currentCarInstance = writable<Object3D | null>(null);

/**
 * Counting down when the race is about to start
 */
export const currentRaceStartCountDown = writable<number>(0);