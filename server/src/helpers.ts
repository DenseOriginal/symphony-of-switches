import { ColorChannel, RGB } from "./types";

// rainbow-colors, taken from http://goo.gl/Cs3H0v
export function colorwheel(pos: number): RGB {
    pos = 255 - pos;
    if (pos < 85) { return [255 - pos * 3, 0, pos * 3]; }
    else if (pos < 170) { pos -= 85; return [0, pos * 3, 255 - pos * 3]; }
    else { pos -= 170; return [pos * 3, 255 - pos * 3, 0]; }
}

export function rgb2Int(r: number, g: number, b: number): number {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

export function colorChannelToNumberUInt32(values: ColorChannel): Uint32Array {
    return Uint32Array.from(values.map(([r, g, b]) => rgb2Int(r, g, b)));
}

export function diffuseSpot(colorChannel: ColorChannel): void {
    const diffuseAmount = 0.9;
    const spread = .01;

    for (let i = 0; i < colorChannel.length; i++) {
        const prev: RGB = i == 0 ? [0, 0, 0] : colorChannel[i - 1];
        const now = colorChannel[i];
        const next: RGB = i == colorChannel.length - 1 ? [0, 0, 0] : colorChannel[i + 1];

        colorChannel[i] = [
            ((prev[0] * spread) + (now[0] * (1 - spread * 2)) + (next[0] * spread)),
            ((prev[1] * spread) + (now[1] * (1 - spread * 2)) + (next[1] * spread)),
            ((prev[2] * spread) + (now[2] * (1 - spread * 2)) + (next[2] * spread))
        ].map(v => v * diffuseAmount) as RGB;
    }
}

export function randomColor(): RGB {
    return colorwheel(Math.random() * 255);
}

export function addRandomColorSpot(colorChannel: ColorChannel): void {
    const i = ~~(Math.random() * colorChannel.length);
    colorChannel[i] = randomColor();
}

export function mergeColors(a: RGB, b: RGB): RGB {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ].map(v => clamp(v, 0, 255)) as RGB;
}

export function clamp(input: number, min: number, max: number): number {
    return input < min ? min : input > max ? max : input;
}

export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    const mapped: number = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
    return clamp(mapped, out_min, out_max);
}

export const COLORS = {
    black: [0, 0, 0] as RGB,
}