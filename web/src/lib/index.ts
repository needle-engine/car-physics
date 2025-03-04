export * from "./stores.js";

if (typeof window !== "undefined") {

    // To support SSR
    Promise.all([
        import("@needle-tools/engine"),
        import("@needle-tools/car-physics")
    ]).then(([ne, carphysics]) => {

        // listen to the needle engine start
        ne.onStart(async context => {

            context.menu.setVisible(false);



        });
    });
}