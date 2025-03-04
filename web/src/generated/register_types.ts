// Import types from dependencies
import "@needle-tools/car-physics/codegen/register_types.ts"

/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { CarCameraRig } from "../scripts/CarCamera.js";
import { CarFollow } from "../scripts/CarCamera.js";
import { CarLoader } from "../scripts/CarLoader.js";
import { GameManager } from "../scripts/GameManager.js";
import { Checkpoint } from "../scripts/RacingGame.js";
import { RacingGame } from "../scripts/RacingGame.js";
import { SelectableCar } from "../scripts/SelectableCar.js";

// Register types
TypeStore.add("CarCameraRig", CarCameraRig);
TypeStore.add("CarFollow", CarFollow);
TypeStore.add("CarLoader", CarLoader);
TypeStore.add("GameManager", GameManager);
TypeStore.add("Checkpoint", Checkpoint);
TypeStore.add("RacingGame", RacingGame);
TypeStore.add("SelectableCar", SelectableCar);
