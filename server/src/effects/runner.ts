import { randomColor } from "../helpers";
import { RunnerState, State } from "../types";

export function singleRunner(state: State, idx: number): void {
    const {
        pos,
        color,
        speed
    } = state.runners[idx];

    if (speed < 0.01) {
        state.runners.splice(idx, 1);
        return;
    }

    state.runners[idx].pos += speed;
    state.colorChannel[~~(pos % state.NUM_LEDS)] = color;

    state.runners[idx].speed *= 0.95;
}

export function runnerIdle(state: State): void {
    for (let i = state.runners.length - 1; i >= 0; i--) {
        singleRunner(state, i);
    }
}

export function runnerEffect(state: State, intensity: number): void {
    state.runners.push({
		color: randomColor(),
		pos: Math.random() * state.NUM_LEDS,
		speed: intensity,
	});
}
