import { currentCarInstance, gamestate, menuOpen } from "$lib";
import { Behaviour, Camera, getTempVector, Mathf, serializable, SmoothFollow } from "@needle-tools/engine";
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
    speed: number = 6;

    @serializable()
    rotateInPause: boolean = true;

    private _value = 0;

    onEnable(): void {
        this._value = 0;
    }

    onBeforeRender(): void {
        const car = get(currentCarInstance);

        if (car) {
            let speed = this.speed;
            const raceFinished = get(gamestate) === "race-finished";
            if (raceFinished) {
                // Dont follow the car anymore when the race has finished
                this._value *= 1 + this.context.time.deltaTime / .3;
            }
            else {
                this._value = Mathf.lerp(this._value, 1 / speed, this.context.time.deltaTime / 2);
            }

            this._value = Math.max(.01, this._value);
            const carWp = car.worldPosition;
            const newPos = this.gameObject.worldPosition.lerp(carWp, this.context.time.deltaTime / this._value);
            this.gameObject.worldPosition = newPos;

            // dont copy rotation when the race has finished
            if (!raceFinished) {
                // rotate slightly around the car when the menu is open
                if (this.rotateInPause && get(menuOpen)) {
                    const forward = car.worldForward;
                    forward.y = 0;
                    this.gameObject.worldPosition = this.gameObject.worldPosition.lerp(forward.multiplyScalar(5).add(carWp), this.context.time.deltaTimeUnscaled / 3);
                    this.gameObject.rotateOnWorldAxis(new Vector3(0, 1, 0), this.context.time.deltaTimeUnscaled / 15);
                }
                // otherwise we simply want to follow the car
                else {
                    this.gameObject.worldQuaternion = this.gameObject.worldQuaternion.slerp(car.worldQuaternion, this.context.time.deltaTime / this._value * .8);
                }
            }

        }
    }

} 