import { currentCarInstance } from "$lib";
import { Behaviour, Camera, serializable, SmoothFollow } from "@needle-tools/engine";
import { get } from "svelte/store";
import { Object3D, Vector3 } from "three";


export class CarCameraRig extends Behaviour {

    private cameraStartPosition?: Vector3;

    awake(): void {
        // assuming OrbitControls handles the look direction
        const camera = this.gameObject.getComponentInChildren(Camera);
        if (camera) {
            this.cameraStartPosition = camera.gameObject.position.clone();
        }
    }

    resetCamera() {
        if (this.cameraStartPosition) {
            const camera = this.gameObject.getComponentInChildren(Camera);
            if (camera) {
                camera.gameObject.position.copy(this.cameraStartPosition);
            }
        }
    }

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
            console.error("LIFE No gameobject - there seems to be a bug", this.name, this.destroyed);
            if (this.destroyed) {
                this._unsubscribe?.();
            }
            return;
        }
        let follow = this.gameObject.getComponentInChildren(SmoothFollow);
        if (!follow) {
            follow = this.gameObject.addComponent(SmoothFollow, {
                followFactor: 10,
                rotateFactor: 0,
            });
        }
        if (follow) {
            follow.target = car;
        }
    }

}