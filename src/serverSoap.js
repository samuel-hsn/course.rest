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

            divar: function (args) {
                console.log('divar called');
                console.log(args);
                if (args.b == 0) {
                    throw {
                        Fault: {
                          Code: {
                            Value: 'soap:Sender',
                            Subcode: { value: 'rpc:BadArguments' }
                          },
                          Reason: { Text: 'b cannot be 0' },
                          statusCode: 500
                        }
                      };
                }
                var n = parseInt(args.a) / parseInt(args.b);
                return {
                    res: n
                };
                
            }
        }
    }
};  

var xml = fs.readFileSync('./src/wscalc1.wsdl', 'utf8');

const server = http.createServer(function (request, response) {
    response.end('404: Not Found: ' + request.url);
});
console.log('Server is running at: http://localhost:8000');
server.listen(8000);
soap.listen(server, '/wscalc1', service, xml);