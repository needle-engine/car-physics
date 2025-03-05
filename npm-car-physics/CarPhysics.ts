import { DynamicRayCastVehicleController, World, RigidBody as RapierRigidbody, Collider as RapierCollider } from "@dimforge/rapier3d-compat";

import { Behaviour, Gizmos, Mathf, Rigidbody, getParam, getTempVector, serializable, FrameEvent, delayForFrames, Collider, BoxCollider, getBoundingBox, OneEuroFilter } from "@needle-tools/engine";

import { Vector3, Quaternion, Object3D } from "three";
import { CarAxle, CarDrive } from "./constants.js";
import { CarWheel } from "./CarWheel.js";

const debugCar = getParam("debugcar");

export class CarPhysics extends Behaviour {

    @serializable()
    carDrive: CarDrive = CarDrive.all;

    @serializable()
    mass: number = 150;

    // @tooltip The maximum steering angle in degrees
    /**
     * The maximum steering angle in degrees
     * @default 50
     */
    @serializable()
    maxSteer: number = 50;

    /**
     * The steering smoothing factor. The higher the value, the slower the steering response (the more smoothing will be applied)
     * @default .1
     */
    @serializable()
    steerSmoothingFactor: number = .1;

    /**
     * The acceleration force in Newtons
     * @default 5
     */
    @serializable()
    accelerationForce: number = 5;

    /**
     * The breaking force in Newtons
     * @default 7
     */
    @serializable()
    breakForce: number = 7;

    /**
     * The top speed of the car in m/s
     * @default 25
     */
    @serializable()
    topSpeed: number = 25;

    /**
     * The wheels of the car. If none are provided, the script will try to find them in the child hierarchy based on their name.   
     * The name should contain "wheel" and "front" or "rear" or "fl" or "fr" or "rl" or "rr" to determine the axle.
     * E.g. 
     * - "WheelFrontLeft"
     * - "WheelFrontRight"
     * - "WheelRearLeft"
     * - "WheelRearRight"
     * - "WheelFL"
     * - "WheelFR"
     * - ...
     * @default []
     */
    @serializable(CarWheel)
    wheels: CarWheel[] = [];

    /**
     * Steer the car. -1 is full left, 1 is full right
     * @param steerAmount -1 to 1
     */
    steerImpulse(steerAmount: number) {
        // steering smoothing
        // const t = Mathf.clamp01(this.context.time.deltaTime / Math.max(.05, this.steerSmoothingFactor));
        this._steerInput += steerAmount;
        this._steerInput = Mathf.clamp(this._steerInput, -1, 1);
    }

    /**
     * Increase or decrease acceleration
     * @param accelAmount -1 to 1 where -1 is full brake and 1 is full acceleration
     */
    accelerationImpulse(accelAmount: number) {
        this._currAcc += accelAmount;
    }

    /**
     * This will always apply the break force to the car
     * @param breakAmount The amount of break force to apply e.g. 1 for full break
     */
    breakImpulse(breakAmount: number) {
        this._currBreak += breakAmount;
    }


    /** Rigidbody component */
    get rigidbody() { return this._rigidbody; }
    /**
     * Rapier Physics Rigidbody (owned by the rigidbody componenti)
     */
    get rapierRigidbody(): RapierRigidbody {
        return this.context.physics.engine?.getBody(this._rigidbody)!;
    }
    /**
     * Rapier Physics Vehicle Controller
     */
    get vehicle() { return this._vehicle; }

    /**
     * The rigidbody velocity vector of the car in worldspace
     */
    get velocity() { return this._rigidbody?.getVelocity(); }
    /**
     * Current vehicle speed
     */
    get currentSpeed() {
        return this._vehicle.currentVehicleSpeed();
    }

    /**
     * Current vehicle speed in km/h
     */
    get currentSpeedInKmh() {
        return this.currentSpeed * 3.6;
    }

    /**
     * Current vehicle speed normalized between 0 and 1 where 1 is the top speed
     */
    get currentSpeed01() {
        return this._vehicle.currentVehicleSpeed() / this.topSpeed;
    }

    /** 
     * The airtime of the car in seconds
     */
    get airtime() {
        return this._airtime;
    }
    set airtime(val: number) {
        this._airtime = val;
    }

    private _vehicle!: DynamicRayCastVehicleController;
    private _rigidbody!: Rigidbody;

    private _currentSteer: number = 0;
    private _currAcc: number = 0;
    private _currBreak: number = 0;

    private _steerInput: number = 0;
    private _airtime: number = 0;


    /** @internal */
    awake(): void {
        if (!this._rigidbody) {
            this._rigidbody = this.gameObject.addComponent(Rigidbody);
        }
        // Ensure we have a collider
        if (!this.gameObject.getComponentInChildren(BoxCollider)) {
            const collider = BoxCollider.add(this.gameObject);
            // Move the collider to a child object
            // Otherwise the offset of the collider doesnt play well with the car rigidbody - needs investigation
            // See https://linear.app/needle/issue/NE-6452
            const obj = new Object3D();
            obj.addComponent(collider);
            this.gameObject.add(obj);
            obj.position.copy(collider.center);
            collider.center.set(0, 0, 0);

            // if an object is higher than longer/wider we clamp the height 
            // this avoids offsetting the mass too much to the top which will make stuff easily fall over
            // rapier uses the attached colliders to calculate the center of mass and it seems like
            // the only way to modify the center of mass in rigidbodies is via additional mass
            // https://rapier.rs/docs/user_guides/javascript/rigid_bodies#mass-properties
            // TODO: test if we can set the centerOfMass of our Rigidbody component.
            // const maxSurface = Math.max(collider.size.x, collider.size.z);
            // if(maxSurface < collider.size.y) {
            //     collider.size.y = maxSurface * 1.2;
            // }

            collider.center.y += collider.size.y * .1;
            collider.size.x *= .85;
            collider.size.y *= .7;
            collider.size.z *= .85;
            collider.updateProperties();
        }
    }

    private _physicsRoutine?: Generator;
    /** @internal */
    async onEnable() {
        if (this.mass <= 0) {
            this.mass = 1;
        }
        // get or create needle rigidbody
        this._rigidbody = this.gameObject.getOrAddComponent(Rigidbody)!;
        this._rigidbody.mass = this.mass;
        this._rigidbody.autoMass = this.mass <= 0;
        // this._rigidbody.centerOfMass.copy(this._rigidbody.gameObject.worldUp.multiplyScalar(100))

        await this.context.physics.engine?.initialize().then(() => delayForFrames(1));
        if (!this.activeAndEnabled) return;

        const world = this.context.physics.engine?.world as unknown as World;
        if (!world) {
            console.error("[CarPhysics] Physics world not found");
            return;
        }

        // get rapier rigidbody
        if (!this.rapierRigidbody) {
            console.error("[CarPhysics] Rigidbody not found");
            return;
        }

        // create vehicle physics
        if (!this._vehicle) {
            this._vehicle = world.createVehicleController(this.rapierRigidbody);
        }
        this._vehicle.indexUpAxis = 1;
        this._vehicle.setIndexForwardAxis = 2;

        // initialize wheels
        if (this.wheels.length === 0) {
            this.wheels.push(...this.gameObject.getComponentsInChildren(CarWheel).filter(x => x.activeAndEnabled));
        }
        // automatically try to find wheel objects in child hierarchy
        if (this.wheels.length <= 0) {
            console.debug(`[CarPhysics] No wheels found on ${this.gameObject.name}, trying to find them`);
            const objs = trySetupWheelsAutomatically(this);
            if (objs.length > 0) {
                console.debug(`[CarPhysics] Found ${objs.length} wheels: ${objs.map(x => `${x.name} (${CarAxle[x.axle]})`).join(", ")}`);
                this.wheels.push(...objs);
            }
        }
        if (this.wheels.length <= 0) {
            console.warn(`[CarPhysics] No wheels found on ${this.gameObject.name}`);
        }

        if (debugCar) {
            console.log(`[CarPhysics] ${this.name} has ${this.wheels.length} wheels:`, this.wheels);
        }

        this.wheels.forEach((wheel, i) => {
            wheel.initialize(this, this._vehicle, i);
        });

        this._physicsRoutine = this.startCoroutine(this.physicsLoop(), FrameEvent.PostPhysicsStep);
    }
    /** @internal */
    onDisable(): void {
        if (this._vehicle) this.context.physics.engine?.world?.removeVehicleController(this._vehicle);
        this._vehicle?.free();
        this._vehicle = null!;
        if (this._physicsRoutine) {
            this.stopCoroutine(this._physicsRoutine);
        }
    }
    onDestroy(): void {
    }

    /** @internal */
    onBeforeRender() {
        if (!this._vehicle) return;

        if (this.steerSmoothingFactor > 0) {
            const t01 = this.context.time.deltaTime / this.steerSmoothingFactor;
            this._currentSteer = Mathf.lerp(this._currentSteer, this._steerInput, Mathf.clamp01(t01));
        }
        else {
            this._currentSteer = this._steerInput;
        }
        this.applyPhysics();
        this._steerInput = 0;
        this._currAcc = 0;
        this._currBreak = 0;

        // update wheels
        let anyWheelHasGroundContact = false;
        this.wheels.forEach((wheel) => {
            wheel.updateVisuals();
            if (!anyWheelHasGroundContact) {
                anyWheelHasGroundContact ||= this._vehicle.wheelIsInContact(wheel.index);
            }
        });
        if (!anyWheelHasGroundContact) {
            this._airtime += this.context.time.deltaTime;
        }
        else this._airtime = 0;

        // render debug
        if (debugCar) {
            const chassis = this._vehicle.chassis();
            const wp = chassis.translation();
            // const wp = this.worldPosition;
            const labelPos = getTempVector(wp).add(getTempVector(0, 2, 0));
            const text = `vel: ${this._vehicle.currentVehicleSpeed().toFixed(2)}`;
            Gizmos.DrawLabel(labelPos, text, 0.1, 0, 0xffffff, 0x000000);

            this.wheels.forEach(x => {
                const cwp = this._vehicle.wheelChassisConnectionPointCs(x.index);
                if (cwp) {
                    Gizmos.DrawLine(getTempVector(wp), getTempVector(cwp).applyQuaternion(chassis.rotation()).add(wp), 0x0000ff, 0, false);
                }
            });
        }
    }


    teleport(worldPosition: Vector3 | undefined, worldRotation: Quaternion | undefined, resetVelocities: boolean = true) {
        if (!this.rapierRigidbody || !this._vehicle) return;

        if (worldPosition) {
            this.rapierRigidbody.setTranslation(worldPosition, true);
        }

        if (worldRotation) {
            this.rapierRigidbody.setRotation(worldRotation, true);
        }

        if (resetVelocities) {
            this._rigidbody.setVelocity(0, 0, 0);
        }
    }

    private *physicsLoop() {
        while (true) {
            if (this._vehicle) {
                const dt = this.context.time.deltaTime;
                // this._rigidbody.wakeUp();
                this._vehicle?.updateVehicle(dt);
            }
            yield null;
        }
    }

    private applyPhysics() {
        this._currAcc = Mathf.clamp(this._currAcc, -1, 1);

        let breakForce = this._currAcc === 0 ? .2 : 0;
        let accelForce = 0;


        const velDir = this._rigidbody.getVelocity();
        const vel = this._vehicle.currentVehicleSpeed();
        const reachedTopSpeed = vel > this.topSpeed;

        const pullForce = this.context.time.deltaTime * this.mass * this.currentSpeed01 * 9.81 * Mathf.clamp01(1 - Math.pow(this._airtime, 2));
        this._rigidbody.applyImpulse(getTempVector(0, -pullForce, 0))

        // breaking
        // apply break if we're receiving negative input and are moving forward
        const isBreaking = this._currAcc < 0 && vel > 0.05 && velDir.dot(this.gameObject.worldForward) > 0;
        if (isBreaking) {
            breakForce = this.breakForce * -this._currAcc;
        }

        // acceleration
        const isAccelerating = this._currAcc != 0 && !reachedTopSpeed;
        if (isAccelerating) {
            accelForce = (this.accelerationForce / this.context.time.deltaTime) * this._currAcc;
        }

        // steer
        const maxAngle = Mathf.lerp(this.maxSteer, this.maxSteer * .5, this.currentSpeed01);
        const steer = this._currentSteer * maxAngle * Mathf.Deg2Rad;

        breakForce += Math.max(0, this._currBreak) * this.breakForce;

        // updateWheels
        this.wheels.forEach((wheel) => {
            wheel.applyPhysics(accelForce, breakForce, steer);
        });
    }
}


function trySetupWheelsAutomatically(car: CarPhysics): CarWheel[] {

    const wheels = new Array<CarWheel>();
    traverse(car.gameObject);

    if (wheels.length <= 0) {
        const pos = car.gameObject.worldPosition;
        const quat = car.gameObject.worldQuaternion;
        car.gameObject.worldPosition = new Vector3();
        car.gameObject.worldQuaternion = new Quaternion();
        const bounds = getBoundingBox(car.gameObject);
        car.gameObject.worldQuaternion = quat;
        car.gameObject.worldPosition = pos;

        const height = bounds.max.y - bounds.min.y;
        const maxHorizontalSurface = Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z);
        const heightVsMaxSurface = height / maxHorizontalSurface;

        const size = bounds.getSize(new Vector3());
        const wheelRadius = (size.length()) * .1;
        const wheelY = bounds.min.y + wheelRadius;
        let insetFactorHorizontal = (bounds.max.x - bounds.min.x) * .1;
        let insetFactorVertical = (bounds.max.z - bounds.min.z) * .1;

        // if the object is much higher than it is wide, we want to push the wheels out!
        if (heightVsMaxSurface > 1) {
            insetFactorHorizontal *= -heightVsMaxSurface * 1.5;
            insetFactorVertical *= -heightVsMaxSurface * 1.5;
        }

        // creating 4 wheels in the corners
        const frontLeft = new Object3D();
        frontLeft.position.set(bounds.min.x + insetFactorHorizontal, wheelY, bounds.max.z - insetFactorVertical);
        frontLeft.name = "WheelFrontLeft";
        wheels.push(frontLeft.addComponent(CarWheel, {
            axle: CarAxle.front,
            radius: wheelRadius,
        }));
        car.gameObject.add(frontLeft);

        const frontRight = new Object3D();
        frontRight.position.set(bounds.max.x - insetFactorHorizontal, wheelY, bounds.max.z - insetFactorVertical);
        frontRight.name = "WheelFrontRight";
        wheels.push(frontRight.addComponent(CarWheel, {
            axle: CarAxle.front,
            radius: wheelRadius,
        }));
        car.gameObject.add(frontRight);

        const rearLeft = new Object3D();
        rearLeft.position.set(bounds.min.x + insetFactorHorizontal, wheelY, bounds.min.z + insetFactorVertical);
        rearLeft.name = "WheelRearLeft";
        wheels.push(rearLeft.addComponent(CarWheel, {
            axle: CarAxle.rear,
            radius: wheelRadius,
        }));
        car.gameObject.add(rearLeft);

        const rearRight = new Object3D();
        rearRight.position.set(bounds.max.x - insetFactorHorizontal, wheelY, bounds.min.z + insetFactorVertical);
        rearRight.name = "WheelRearRight";
        wheels.push(rearRight.addComponent(CarWheel, {
            axle: CarAxle.rear,
            radius: wheelRadius,
        }));
        car.gameObject.add(rearRight);

    }
    return wheels;

    function traverse(obj: Object3D) {

        for (const ch of obj.children) {
            const name = ch.name.toLowerCase();
            if (name.includes("wheel")) {
                if (!ch.getComponent(CarWheel)) {
                    const front = name.includes("front") || name.includes("fl") || name.includes("fr");
                    // const right = name.includes("right") || name.includes("fr") || name.includes("rr");
                    const wheel = ch.addComponent(CarWheel, {
                        axle: front ? CarAxle.front : CarAxle.rear,
                    });
                    wheels.push(wheel);
                }
            }
        }

        for (const ch of obj.children) {
            if (wheels.length > 0) break;
            if (ch instanceof Object3D) {
                traverse(ch);
            }
        }

    }

}