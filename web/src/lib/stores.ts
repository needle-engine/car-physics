import { writable } from "svelte/store";
import type { Object3D } from "three";

export type Gamestate = "loading" | "main-menu" | "track-selection" | "car-selection" | "race-idle" | "race-in-progress" | "race-finished";

export const gamestate = writable<Gamestate>("loading");
gamestate.subscribe(state => {
    console.debug("[Gamestate]", state);
})

export type GameOption = {
    name: string;
    thumbnail: string | null;
    select: () => Promise<any>;
}
export const gameoptions = writable<GameOption[]>([]);


export const currentCarInstance = writable<Object3D | null>(null);


export const currentRaceStartCountDown = writable<number>(0);