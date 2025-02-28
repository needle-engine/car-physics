export * from "./stores.js";

import { activeScene, carOptions, scenes, selectedCar } from "./stores.js";

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
                    const controller = value.instance.getComponent(carphysics.CarController);
                    if(controller) selection.selectCar(controller);
                    else console.warn("CarController component not found in the selected car");
                }
                else {
                    console.warn("CarSelection component not found in the scene");
                }
            }
        });

        // listen to the needle engine start
        ne.onStart(async context => {

            context.menu.setVisible(false);

            carOptions.subscribe((options) => {
                // assign the currently active selection
                const selection = ne.findObjectOfType(carphysics.CarController);
                if (selection) {
                    const value = options.find(o => o.instance === selection.gameObject);
                    if (value) selectedCar.set(value);
                    else selectedCar.set(null);
                }
                else {
                    console.debug("No CarController found in the scene");
                }
            });

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
                // const controllers = ne.findObjectsOfType(carphysics.CarController);
                // const options = controllers.map((car) => {
                //     return {
                //         name: car.name,
                //         thumbnail: `/imgs/${car.name.toLowerCase()}.jpg`,
                //         instance: car,
                //     };
                // });
                // carOptions.set(options);

            }

        });
    });
}