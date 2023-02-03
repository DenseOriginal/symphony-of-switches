import dgram from "dgram";

const server = dgram.createSocket('udp4');

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

export function startUdpListener() {
    return server.bind(1337);
}