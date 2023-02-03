import dgram from "node:dgram";
const server = dgram.createSocket('udp4');

// create a new Map object to store the data
const dataMap = new Map();

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
    const id = msg.readUInt8(0);
    const data = msg.readUInt8(1);

    // add the ID and data to the map
    dataMap.set(id, data);
    console.log(`Received data from ${rinfo.address}: ID: ${id}, Data: ${data}`);
});

server.bind(1337);