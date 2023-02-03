import ws281x from "rpi-ws281x-native";
import { runnerEffect, runnerIdle } from "./effects/runner";
import { sparkle } from "./effects/sparkle";
import { addRandomColorSpot, colorChannelToNumberUInt32, diffuseSpot, map, randomColor } from "./helpers";
import { ColorChannel, RGB, State } from "./types";
import { startUdpListener } from "./udp-listener";

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
	runners: []
}

// ---- animation-loop
setInterval(function () {

	diffuseSpot(state.colorChannel);
	runnerIdle(state);
	const uint32Array = colorChannelToNumberUInt32(state.colorChannel);

	for (var i = 0; i < NUM_LEDS; i++) {
		channel.array[i] = uint32Array[i];
	}

	ws281x.render();

	state.iterations++;
}, 1000 / 30);

console.log('Press <ctrl>+C to exit.');

startUdpListener()
	.on('message', (msg) => {
		const id = msg.readUInt8(0);
		const data = msg.readUInt8(1);
		console.log(`Received data from ID: ${id}, Data: ${data}`);
	
		switch (id) {
			case 0: return sparkle(state, map(data, 0, 255, 0, NUM_LEDS));
			case 1: return runnerEffect(state, map(data, 0, 255, 0, 1));
			default: break;
		}
		// add the ID and data to the map
	});
