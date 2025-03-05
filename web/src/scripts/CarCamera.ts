import { currentCarInstance, gamestate } from "$lib";
import { Behaviour, Camera, Mathf, serializable, SmoothFollow } from "@needle-tools/engine";
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

    @serializable()
    speed: number = 5;

    private _value = 0;

    onEnable(): void {
        this._value = 0;
    }

    onBeforeRender(): void {
        const car = get(currentCarInstance);

        if (car) {
            let postSpeed = this.speed;

            // Dont follow the car anymore when the race has finished
            const raceFinished = get(gamestate) === "race-finished";
            if (raceFinished) {
                postSpeed *= .005;
            }

            // We want to interpolate
            const step = 1 / postSpeed;
            this._value = Mathf.lerp(this._value, step, this.context.time.deltaTime / .3);
            this._value = Math.max(.01, this._value);

            this.gameObject.worldPosition = this.gameObject.worldPosition.lerp(car.worldPosition, this.context.time.deltaTime / this._value);

            // dont copy rotation when the race has finished
            if (!raceFinished) {
                this.gameObject.worldQuaternion = this.gameObject.worldQuaternion.slerp(car.worldQuaternion, this.context.time.deltaTime / this._value);
            }

        }
    }

}