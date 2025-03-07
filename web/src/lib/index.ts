import { updateSettings } from "./stores.js";
import type { screenshot2 } from "@needle-tools/engine";

export * from "./stores.js";


let screenshotFn: typeof screenshot2 | undefined = undefined;

export async function screenshot(): Promise<any> {
    return await screenshotFn?.({
        // width: 1024,
        // height: 960,
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
            context.menu.setVisible(false);
        });
    });
}