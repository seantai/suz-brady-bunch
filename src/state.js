import { Vector2 } from "three";
import { proxy } from "valtio";

export const pointerStore = proxy({ state: new Vector2() });
