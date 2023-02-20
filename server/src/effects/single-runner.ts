import { State } from "../types";

export function singleRunnerIdle(state: State): void {
    const {
        pos,
        color,
        speed
    } = state.singleRunner;

    if (speed < 0.01) return;

    state.singleRunner.pos += speed;
    state.colorChannel[~~(pos % state.NUM_LEDS)] = color;

    state.singleRunner.speed *= 0.95;
}

export function singleRunnerEffect(state: State, intensity: number): void {
    state.singleRunner.speed += intensity;
}