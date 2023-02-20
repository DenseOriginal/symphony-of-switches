import { mergeColors } from "../helpers";
import { RGB, State } from "../types";

export function colorSparkle(state: State, intensity: number, color: RGB) {
    for (let i = 0; i < intensity; i++) {
        setTimeout(() => {
            const i = ~~(Math.random() * state.colorChannel.length);
            state.colorChannel[i] = mergeColors(color, state.colorChannel[i]);
        }, Math.random() * 100);
    }
}