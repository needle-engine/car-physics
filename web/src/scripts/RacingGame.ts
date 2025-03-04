// import { bestlap, laptime, lastlap } from "$lib";
import { currentCarInstance, type Gamestate, gamestate } from "$lib";
import { CarController, CarPhysics } from "@needle-tools/car-physics";
import { Behaviour, getTempVector, PlayableDirector, Rigidbody, serializable } from "@needle-tools/engine";
import { Object3D, Ray, Vector3 } from "three";
import { CarCameraRig } from "./CarCamera";
import { get } from "svelte/store";

export class Checkpoint extends Behaviour {
    setHighlight(highlight: boolean) {
        this.gameObject.visible = highlight;
    }
}
export class RacingGame extends Behaviour {

    @serializable(PlayableDirector)
    introTimeline: PlayableDirector | null = null;

    @serializable(Object3D)
    startPoint?: Object3D;

    @serializable(CarCameraRig)
    cameraRig?: CarCameraRig;

    @serializable(Checkpoint)
    checkpoints: Checkpoint[] = [];

    // setCar(car: Object3D) {
    //     if (this.car && this.car.gameObject != car) {
    //         this.car?.gameObject?.removeFromParent();
    //     }
    //     if (!car.getComponentInChildren(CarPhysics)) car.addComponent(CarPhysics);
    //     this.car = car.getComponentInChildren(CarController) || car.addComponent(CarController);
    //     if (this.startPoint) {
    //         this.car.worldPosition = this.startPoint.worldPosition;
    //         this.car.worldQuaternion = this.startPoint.worldQuaternion;
    //     }
    // }

    private _unsubscribe: (() => void) | null = null;

    onEnable(): void {
        this.onGameStateChanged(get(gamestate));
        this._unsubscribe = gamestate.subscribe(this.onGameStateChanged);

        // if (this.car) {
        //     this.car.manualReset = false;
        // }
        this._nextCheckpointIndex = 0;
        this._lastCheckpoint = null;
        this._lapStartTime = 0;
        // laptime.set(0);

        this._bestLapTime = parseFloat(localStorage.getItem("bestlap") || "0");
        // bestlap.set(this._bestLapTime);

        for (const check of this.checkpoints) {
            check?.setHighlight(false);
        }
        this.checkpoints[0]?.setHighlight(true);
    }

    onDisable(): void {
        this._unsubscribe?.();
        // laptime.set(-1);
    }

    private onGameStateChanged = (state: Gamestate) => {
        switch (state) {
            case "race-idle":
                if (this.cameraRig) this.cameraRig.gameObject.visible = false;
                if (this.introTimeline) {
                    this.introTimeline.gameObject.visible = true;
                    this.introTimeline.time = 0;
                }
                break;
            case "race-in-progress":
                if (this.cameraRig) {
                    this.cameraRig.gameObject.visible = true;
                }
                if (this.introTimeline) this.introTimeline.gameObject.visible = false;
                break;
            case "race-finished":
                if (this.cameraRig) this.cameraRig.gameObject.visible = false;
                if (this.introTimeline) {
                    this.introTimeline.gameObject.visible = true;
                    this.introTimeline.time = 0;
                }
                break;
        }
    }

    private _nextCheckpointIndex: number = 0;
    private _lastCheckpoint: Checkpoint | null = null;

    // timings
    private _lapStartTime: number = 0;
    private _lastLapTime: number = 0;
    private _bestLapTime: number = 0;

    lateUpdate(): void {

        const car = get(currentCarInstance);
        if(!car) return;

        const yButtonIndex = 3;
        if (this.context.input.isKeyDown("r") || navigator.getGamepads().some(gp => gp?.buttons[yButtonIndex].pressed)) {
            this.resetCar();
        }

        const next = this.checkpoints[this._nextCheckpointIndex];
        if (!next) {
            return;
        }


        const wp = car?.worldPosition;
        const local = next.gameObject.worldToLocal(getTempVector(wp));
        const ax = Math.abs(local.x);
        const az = Math.abs(local.z);
        const ay = Math.abs(local.y);
        const inCheckpoint = ax < 1 && az < 1 && ay < 1;

        if (inCheckpoint) {
            next.setHighlight(false);

            if (this._nextCheckpointIndex === 0) {

                if (this._lapStartTime > 0) {
                    const currentLaptime = this.context.time.realtimeSinceStartup - this._lapStartTime;
                    if (currentLaptime < this._bestLapTime || this._bestLapTime === 0) {
                        this._bestLapTime = currentLaptime;
                        // bestlap.set(this._bestLapTime);
                        localStorage.setItem("bestlap", this._bestLapTime.toString());
                    }
                    this._lastLapTime = currentLaptime;
                    // lastlap.set(this._lastLapTime);
                }

                this._lapStartTime = this.context.time.realtimeSinceStartup;
            }


            this._lastCheckpoint = next;

            // highlight the next checkpoint
            this._nextCheckpointIndex++;
            if (this._nextCheckpointIndex >= this.checkpoints.length) {
                this._nextCheckpointIndex = 0;
            }
            this.checkpoints[this._nextCheckpointIndex].setHighlight(true);
        }

        // const currentLaptime = this._lapStartTime ? (this.context.time.realtimeSinceStartup - this._lapStartTime) : 0;
        // laptime.set(currentLaptime);
    }

    resetCar() {
        const car = get(currentCarInstance);
        if (this._lastCheckpoint && car) {

            const wp = this._lastCheckpoint.worldPosition;
            const wq = this._lastCheckpoint.worldQuaternion;

            // raycast down to find the street
            const ray = new Ray(wp, new Vector3(0, -1, 0));
            const hits = this.context.physics.raycastFromRay(ray);
            if (hits.length) {
                wp.copy(hits[0].point);
                wp.y += .5;
            }

            const rigidbody = car.getComponentInChildren(Rigidbody);
            if (rigidbody) {
                rigidbody.teleport(wp, false);
                rigidbody.gameObject.worldQuaternion = wq;
            }
            else {
                car.worldPosition = wp;
                car.worldQuaternion = wq;
            }
        }
    }

}