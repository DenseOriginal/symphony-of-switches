import * as readline from "readline";
import dgram from "dgram";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const server = dgram.createSocket('udp4');

function doStuff() {
    rl.question('ID,value: ', val => {
        console.log(val);
        
        const [id, value] = val.split(',').map(x => parseInt(x));
        console.log(`Sending ID: ${id}, Value: ${value}`);

        server.send(
            Buffer.from([id, value]),
            1337,
            '0.0.0.0'
        );

        doStuff();
    });
}

doStuff();
