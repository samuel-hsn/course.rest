const fs = require('fs');
const http = require('http');
const soap = require('soap');

const service = {
    ws: {
        calc: {
            sumar: function (args) {
                console.log('sumar called');
                console.log(args);
                var n = parseInt(args.a) + parseInt(args.b);
                return {
                    res: n
                };
            },

            multiplicar: function (args) {
                console.log('multiplicar called');
                console.log(args);
                var n = parseInt(args.a) * parseInt(args.b);
                return {
                    res: n
                };
                
            },
            divar: function (args, callback) {
                console.log('divar called');
                console.log(args);
                if (isNaN(args.a) || isNaN(args.b)) {
                    return callback({
                        Fault: {
                            faultcode: 'Client',
                            faultstring: 'Invalid input: a and b must be integers'
                        }
                    });
                }
                if (parseInt(args.b) === 0) {
                    return callback({
                        Fault: {
                            faultcode: '500',
                            faultstring: 'Division by zero error'
                        }
                    });
                }
                var n = parseInt(args.a) / parseInt(args.b);
                callback(null, { divres: n });
            }
        }
    }
};  

var xml = fs.readFileSync('./Sources/wscalc1.wsdl', 'utf8');

const server = http.createServer(function (request, response) {
    response.end('404: Not Found: ' + request.url);
});
console.log('Server is running at: http://localhost:8000');
server.listen(8000);
soap.listen(server, '/wscalc1', service, xml);