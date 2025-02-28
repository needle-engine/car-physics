// Import types from dependencies
import "@needle-tools/car-physics/codegen/register_types.ts"

/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { CarLoader } from "../scripts/CarLoader.js";
import { Checkpoint } from "../scripts/RacingGame.js";
import { RacingGame } from "../scripts/RacingGame.js";
import { SelectableCar } from "../scripts/SelectableCar.js";

// Register types
TypeStore.add("CarLoader", CarLoader);
TypeStore.add("Checkpoint", Checkpoint);
TypeStore.add("RacingGame", RacingGame);
TypeStore.add("SelectableCar", SelectableCar);
