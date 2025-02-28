import { writable } from "svelte/store";
import { Object3D } from "three";

export const laptime = writable(-1);
export const lastlap = writable(-1);
export const bestlap = writable(-1);

declare type SceneInfo = {
    name: string,
    index: number,
    load: () => Promise<any>,
}

export const scenes = writable<Array<SceneInfo>>([]);
export const activeScene = writable<SceneInfo | null>(null);

declare type CarInfo = {
    name: string,
    thumbnail: string | null,
    instance: Object3D,
}

export const carOptions = writable<Array<CarInfo>>([]);
export const selectedCar = writable<CarInfo | null>(null);