export type RGB = [number, number, number];
export type ColorChannel = RGB[];

export interface State {
    colorChannel: ColorChannel;
    NUM_LEDS: number;
    iterations: number;
    runners: RunnerState[];
    singleRunner: RunnerState;
}

interface RunnerState {
    pos: number;
    color: RGB;
    speed: number;
}