// import { bestlap, laptime, lastlap } from "$lib";
import { currentCarInstance, currentRaceStartCountDown, type Gamestate, gamestate } from "$lib";
import { CarController, CarPhysics } from "@needle-tools/car-physics";
import { Behaviour, Camera, getTempVector, Gizmos, OrbitControls, PlayableDirector, Rigidbody, serializable } from "@needle-tools/engine";
import { Object3D, Ray, Vector3 } from "three";
import { CarCameraRig } from "./CarCamera";
import { get } from "svelte/store";
import { GameManager } from "./GameManager";

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

    private _unsubscribeGamestate: Function | null = null;
    private _unsubscribeCar: Function | null = null;

    onEnable(): void {
        this.onGameStateChanged(get(gamestate));
        this._unsubscribeGamestate = gamestate.subscribe(this.onGameStateChanged);
        this._unsubscribeCar = currentCarInstance.subscribe(this.onCarChanged);

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
        this._unsubscribeGamestate?.();
        this._unsubscribeCar?.();
    }

    private _startTime: number = 0;

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
                this._startTime = Date.now();
                if (this.cameraRig) {
                    this.cameraRig.gameObject.visible = true;
                }
                if (this.introTimeline) this.introTimeline.gameObject.visible = false;
                if (this.startPoint) {
                    const car = get(currentCarInstance);
                    if (car) {
                        this.resetCar(this.startPoint);
                    }
                }
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

    private _carPhysics: CarPhysics | null = null;
    private _carController: CarController | null = null;

    private onCarChanged = (car: Object3D | null) => {
        this._carPhysics = car?.getComponentInChildren(CarPhysics) || null;
        this._carController = car?.getComponentInChildren(CarController) || null;
        if (this._carController) {
            this._carController.reset = () => this.resetCar();
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
        if (!car) return;

        const state = get(gamestate);
        switch (state) {
            case "race-idle":
                if (this._carController) this._carController.enabled = false;
                if (this._carPhysics) this._carPhysics.breakImpulse(1)
                break;
            case "race-finished":
                if (this._carController) this._carController.enabled = false;
                break;
            case "race-in-progress":

                const secondsSinceStart = (Date.now() - this._startTime) / 1000;
                const waitBeforeStartInSeconds = 3;
                const countdown = waitBeforeStartInSeconds - Math.floor(secondsSinceStart);
                currentRaceStartCountDown.set(countdown);
                if (countdown <= 0) {
                    if (this._carController) this._carController.enabled = true;
                }


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
                            this.onFinishedLap();
                        }
                        this._lapStartTime = this.context.time.realtimeSinceStartup;
                    }

                    // highlight the next checkpoint
                    this._nextCheckpointIndex++;
                    if (this._nextCheckpointIndex >= this.checkpoints.length) {
                        this._nextCheckpointIndex = 0;
                    }
                    this.checkpoints[this._nextCheckpointIndex].setHighlight(true);

                    this.onReachedCheckpoint(next);
                }

                // const currentLaptime = this._lapStartTime ? (this.context.time.realtimeSinceStartup - this._lapStartTime) : 0;
                // laptime.set(currentLaptime);
                break;
        }
    }

    private onReachedCheckpoint(checkpoint: Checkpoint) {
        this._lastCheckpoint = checkpoint;
    }

    private onFinishedLap() {
        const currentLaptime = this.context.time.realtimeSinceStartup - this._lapStartTime;
        if (currentLaptime < this._bestLapTime || this._bestLapTime === 0) {
            this._bestLapTime = currentLaptime;
            // bestlap.set(this._bestLapTime);
            localStorage.setItem("bestlap", this._bestLapTime.toString());
        }
        this._lastLapTime = currentLaptime;
        gamestate.set("race-finished");

        // After a few seconds reset the car to the start position
        setTimeout(() => {
            if (get(gamestate) === "race-finished") {
                this.resetCar(this.startPoint);
            }
        }, 3000)
    }

    resetCar(point?: Object3D) {
        const car = get(currentCarInstance);
        if (car) {

            const targetPositon = point || this._lastCheckpoint || this.startPoint;
            if (targetPositon) {
                const wp = targetPositon.worldPosition;
                const wq = targetPositon.worldQuaternion;
                // const forward = getTempVector(0, 0, 1).applyQuaternion(wq);

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

            const camera = this.cameraRig?.gameObject?.getComponentInChildren(CarCameraRig);
            camera?.resetCamera();
        }
    }

}