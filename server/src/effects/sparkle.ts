import { addRandomColorSpot } from "../helpers";
import { State } from "../types";

export function sparkle(state: State, intensity: number): void {
    for (let i = 0; i < intensity; i++) {
        setTimeout(() => addRandomColorSpot(state.colorChannel), Math.random() * 100);
    }
}