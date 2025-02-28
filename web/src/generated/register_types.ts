// Import types from dependencies
import "@needle-tools/car-physics/codegen/register_types.ts"

/* eslint-disable */
import { TypeStore } from "@needle-tools/engine"

// Import types
import { SelectableCar } from "../scripts/SelectableCar.js";

// Register types
TypeStore.add("SelectableCar", SelectableCar);
