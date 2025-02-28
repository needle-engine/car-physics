import { carOptions } from "$lib";
import { Behaviour, FileReference, serializable } from "@needle-tools/engine";
import { get } from "svelte/store";


/**
 * Component that provides information about available cars to sveltekit store
 */
export class SelectableCar extends Behaviour {

    @serializable(FileReference)
    thumbnail?: FileReference;


    onEnable(): void {
        const opts = get(carOptions); 
        opts.push({
            name: this.gameObject.name,
            thumbnail: this.thumbnail?.url || null,
            instance: this.gameObject,
        });
        carOptions.set(opts);
    }
    onDisable(): void {
        const opts = get(carOptions);
        const index = opts.findIndex(opt => opt.instance === this.gameObject);
        if (index !== -1) {
            opts.splice(index, 1);
            carOptions.set(opts); 
        }
    }

}