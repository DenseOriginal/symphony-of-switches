import ws281x from "rpi-ws281x-native";
import { colorSparkle } from "./effects/color-sparkle";
import { runnerEffect, runnerIdle } from "./effects/runner";
import { singleRunnerEffect, singleRunnerIdle } from "./effects/single-runner";
import { sparkle } from "./effects/sparkle";
import { addRandomColorSpot, colorChannelToNumberUInt32, diffuseSpot, map, randomColor } from "./helpers";
import { ColorChannel, RGB, State } from "./types";
import { startHttpListener } from "./udp-listener";

const NUM_LEDS = 30;

const channel = ws281x(NUM_LEDS, { stripType: 'ws2812', gpio: 18 });

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
	ws281x.reset();
	process.nextTick(function () { process.exit(0); });
});

const state: State = {
	colorChannel: Array.from({ length: NUM_LEDS }).fill([0, 0, 0]) as ColorChannel,
	iterations: 0,
	NUM_LEDS,
	runners: [],
	singleRunner: {
		color: randomColor(),
		pos: Math.random() * NUM_LEDS,
		speed: 0,
	},
	red: false,
}

// ---- animation-loop
setInterval(function () {

	diffuseSpot(state.colorChannel);
	runnerIdle(state);
	singleRunnerIdle(state);
	const uint32Array = !state.red ?
		colorChannelToNumberUInt32(state.colorChannel) :
		colorChannelToNumberUInt32(Array.from({ length: NUM_LEDS }).fill([255, 0, 0]) as RGB[]);

	for (var i = 0; i < NUM_LEDS; i++) {
		channel.array[i] = uint32Array[i];
	}

	ws281x.render();

	state.iterations++;
}, 1000 / 30);

console.log('Press <ctrl>+C to exit.');

startHttpListener((id, data) => {
	console.log(`Received data from ID: ${id}, Data: ${data}`);

	switch (id) {
		case 0: return sparkle(state, map(data, 0, 255, 0, NUM_LEDS));
		case 1: return runnerEffect(state, map(data, 0, 255, 0, 1));
		case 2: return colorSparkle(state, map(data, 0, 255, 0, NUM_LEDS), [255, 0, 0]);
		case 3: return colorSparkle(state, map(data, 0, 255, 0, NUM_LEDS), [0, 255, 0]);
		case 4: return colorSparkle(state, map(data, 0, 255, 0, NUM_LEDS), [0, 0, 255]);
		case 5: return singleRunnerEffect(state, map(data, 0, 255, 0, 0.5));
		case 666: return state.red = true;
		default: break;
	}
})