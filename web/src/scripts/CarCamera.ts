import { currentCarInstance } from "$lib";
import { Behaviour, serializable, SmoothFollow } from "@needle-tools/engine";
import { get } from "svelte/store";
import { Object3D } from "three";


export class CarCameraRig extends Behaviour {

    @serializable(Object3D)
    cameraRoot?: Object3D;

    @serializable(Object3D)
    lookTarget: Object3D | null = null;


}

export class CarFollow extends Behaviour {

    private _unsubscribe: (() => void) | null = null;

    onEnable(): void {
        this._unsubscribe = currentCarInstance.subscribe(this.carChanged);
        this.carChanged(get(currentCarInstance));
    }
    onDisable(): void {
        this._unsubscribe?.();
    }


    private carChanged = (car: Object3D | null) => {
        if (!car) return;
        if (!this.gameObject) {
            console.warn("No gameobject - there seems to be a bug", this.name, this.destroyed);
            if (this.destroyed) {
                this._unsubscribe?.();
            }
            return;
        }
        const follow = this.gameObject.getComponentInChildren(SmoothFollow) || this.gameObject.addComponent(SmoothFollow);
        if (follow) {
            follow.target = car;
        }
    }

}