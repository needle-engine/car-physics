import { writable } from "svelte/store";

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
    instance: any,
}

export const carOptions = writable<Array<CarInfo>>([]);
export const selectedCar = writable<CarInfo | null>(null);

if (typeof window !== "undefined") {

    // To support SSR
    Promise.all([
        import("@needle-tools/engine"),
        import("@needle-tools/car-physics")
    ]).then(([ne, carphysics]) => {

        // Whenever the selected car instance changes, update the car selection in Needle Engine
        selectedCar.subscribe((value) => {
            if (value) {
                const selection = ne.findObjectOfType(carphysics.CarSelection);
                if (selection) {
                    selection.selectCar(value.instance);
                }
            }
        });

        // listen to the needle engine start
        ne.onStart(async context => {

            context.menu.setVisible(false);


            const sceneSwitcher = ne.findObjectOfType(ne.SceneSwitcher);
            if (sceneSwitcher) {
                const options = sceneSwitcher.scenes.map((scene, index) => {
                    const name = scene.url.split("/").pop()?.split(".")?.[0] || "";
                    return {
                        name: name,
                        index: index,
                        load: async () => {
                            return sceneSwitcher.select(index);
                        },
                    };
                });
                scenes.set(options);
                sceneSwitcher.sceneLoaded.addEventListener(() => {
                    const currentScene = sceneSwitcher.currentlyLoadedScene;
                    const currentIndex = !currentScene ? -1 : sceneSwitcher.scenes.indexOf(currentScene);
                    activeScene.set(options.find(o => o.index === currentIndex) || null);
                    onLoadedSceneChanged();
                });
            }

            function onLoadedSceneChanged() {
                const controllers = ne.findObjectsOfType(carphysics.CarController);
                const options = controllers.map((car) => {
                    return {
                        name: car.name,
                        thumbnail: `/imgs/${car.name.toLowerCase()}.jpg`,
                        instance: car,
                    };
                });
                carOptions.set(options);

                // assign the currently active selection
                const selection = ne.findObjectOfType(carphysics.CarController);
                if (selection) {
                    const value = options.find(o => o.instance === selection);
                    if (value) selectedCar.set(value);
                }
            }

        });
    });
}