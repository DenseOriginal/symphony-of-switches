import http from "http";
import dgram from "dgram";

export function startHttpListener(listener: (id: number, data: number) => void) {
    http.createServer(function (request, response) {
        if (request.method == 'POST') {
            var body = ''
            request.on('data', function (data) {
                body += data
            })
            request.on('end', function () {
                const [id, data] = body.split(',').map(Number);
                listener(id, data);
                response.writeHead(200)
                response.end()
            })
        } else {
            console.log('GET')
            response.writeHead(200)
            response.end()
        }
    }).listen(1337);

    console.log('HTTP Server listening');
    
}