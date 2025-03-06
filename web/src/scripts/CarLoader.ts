// import { CarPhysics } from "@needle-tools/car-physics";
// import { AssetReference, AxesHelper, Behaviour, serializable, SmoothFollow } from "@needle-tools/engine";
// import { Object3D } from "three";


// export class CarLoader extends Behaviour {

//     @serializable(Object3D)
//     cameraRig?: Object3D;

//     @serializable(AssetReference)
//     cars: AssetReference[] = [];

//     private _active: AssetReference | null = null;

//     onEnable(): void {
//         // this.loadCar(0);
//     }
//     onDisable(): void {
//         this._active?.asset?.destroy();
//         this._active = null;
//     }

//     async loadCar(asset: AssetReference | number) {

//         if (!this.activeAndEnabled) {
//             console.warn("Cannot load car: the component is disabled");
//             return;
//         }

//         if (typeof asset === "number") {
//             asset = this.cars[asset];
//         }

//         if (asset === this._active) {
//             return;
//         }

//         this._active?.asset?.destroy();
//         this._active = asset;
//         const instance = await asset.loadAssetAsync();

//         if (instance && this.activeAndEnabled && asset === this._active) {
//             console.debug("Loaded car", { instance });

//             this.gameObject.add(instance);

//             if (!instance.getComponentInChildren(CarPhysics)) {
//                 console.warn("CarPhysics component not found: adding a new one", { instance });
//                 instance.addComponent(CarPhysics);
//             }

//             const follow = this.cameraRig?.getComponentInChildren(SmoothFollow);
//             if (follow) {
//                 follow.target = instance;
//             }
//             else {
//                 console.warn("SmoothFollow component not found in the camera rig", { cameraRig: this.cameraRig });
//             }
//         }
//     }

// }