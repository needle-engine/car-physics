import { GameManager } from "../scripts/GameManager.js";
import { gamestate, updateSettings } from "./stores.js";
import { findObjectOfType, type Context, type screenshot2 } from "@needle-tools/engine";

export * from "./stores.js";


let screenshotFn: typeof screenshot2 | undefined = undefined;
let context: Context | undefined = undefined;

export async function screenshot(): Promise<any> {
    // const width = context?.domWidth || window.innerWidth;
    // const height = context?.domHeight || window.innerHeight;
    return await screenshotFn?.({
        // width: width,
        // height: height,
        download_filename: "needle-racing.png",
    });
}

if (typeof window !== "undefined") {

    // To support SSR
    Promise.all([
        import("@needle-tools/engine"),
        import("@needle-tools/car-physics")
    ]).then(([ne, carphysics]) => {

        screenshotFn = ne.screenshot2;

        if (ne.DeviceUtilities.isMobileDevice()) {
            updateSettings({ postprocessing: false });
        }

        // listen to the needle engine start
        ne.onStart(async context => {
            context = context;
            context.menu.setVisible(false);
            const game = findObjectOfType(GameManager);
            if(!game) {
                gamestate.set("main-menu");
            }
        });
    });
}