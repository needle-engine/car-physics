/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { CarController } from "../src/CarController.js";
import { CarDropHelper } from "../src/CarDropHelper.js";
import { CarPhysics } from "../src/CarPhysics.js";
import { CarRadio } from "../src/CarRadio.js";
import { CarSelection } from "../src/CarSelection.js";
import { CarTouchControls } from "../src/CarTouchControls.js";
import { CarWheel } from "../src/CarWheel.js";
import { SkidTrailBehaviour } from "../src/CarWheel.js";
import { CarUIButton } from "../src/CarUIButton.js";

// Register types
TypeStore.add("CarController", CarController);
TypeStore.add("CarDropHelper", CarDropHelper);
TypeStore.add("CarPhysics", CarPhysics);
TypeStore.add("CarRadio", CarRadio);
TypeStore.add("CarSelection", CarSelection);
TypeStore.add("CarTouchControls", CarTouchControls);
TypeStore.add("CarWheel", CarWheel);
TypeStore.add("SkidTrailBehaviour", SkidTrailBehaviour);
TypeStore.add("CarUIButton", CarUIButton);
