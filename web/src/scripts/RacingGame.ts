import { bestlap, laptime, lastlap } from "$lib";
import { CarController } from "@needle-tools/car-physics";
import { Behaviour, getTempVector, Rigidbody, serializable } from "@needle-tools/engine";
import { Ray, Vector3 } from "three";

export class Checkpoint extends Behaviour {
    setHighlight(highlight: boolean) {
        this.gameObject.visible = highlight;
    }
}

export class RacingGame extends Behaviour {

    @serializable(CarController)
    car: CarController | null = null;

    @serializable(Checkpoint)
    checkpoints: Checkpoint[] = [];

    private _nextCheckpointIndex: number = 0;
    private _lastCheckpoint: Checkpoint | null = null;

    // timings
    private _lapStartTime: number = 0;
    private _lastLapTime: number = 0;
    private _bestLapTime: number = 0;

    onEnable(): void {
        if (this.car) {
            this.car.manualReset = false;
        }
        this._nextCheckpointIndex = 0;
        this._lastCheckpoint = null;
        this._lapStartTime = 0;

        laptime.set(0);

        for (const check of this.checkpoints) {
            check?.setHighlight(false);
        }
        this.checkpoints[0]?.setHighlight(true);
    }
    onDisable(): void {
        laptime.set(-1);
    }


    lateUpdate(): void {

        if (!this.car) return;

        if (this.context.input.isKeyDown("r")) {
            this.reset();
        }

        const next = this.checkpoints[this._nextCheckpointIndex];
        if (!next) {
            return;
        }


        const wp = this.car?.worldPosition;
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
                        bestlap.set(this._bestLapTime);
                    }
                    this._lastLapTime = currentLaptime;
                    lastlap.set(this._lastLapTime);
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

        const currentLaptime = this._lapStartTime ? (this.context.time.realtimeSinceStartup - this._lapStartTime) : 0;
        laptime.set(currentLaptime);
    }

    reset() {
        if (this._lastCheckpoint && this.car) {

            const wp = this._lastCheckpoint.worldPosition;
            const wq = this._lastCheckpoint.worldQuaternion;

            // raycast down to find the street
            const ray = new Ray(wp, new Vector3(0, -1, 0));
            const hits = this.context.physics.raycastFromRay(ray);
            if (hits.length) {
                wp.copy(hits[0].point);
                wp.y += .5;
            }

            const rigidbody = this.car.gameObject.getComponentInChildren(Rigidbody);
            if (rigidbody) {
                rigidbody.teleport(wp, false);
                rigidbody.gameObject.worldQuaternion = wq;
            }
            else {
                this.car.worldPosition = wp;
                this.car.worldQuaternion = wq;
            }
        }
    }

}