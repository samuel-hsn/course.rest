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
                var a = parseInt(args.a);
                var b = parseInt(args.b);
                if (b === 0) {
                    throw {
                        Fault: {
                            faultcode: '500',
                            faultstring: 'b cannot be 0',
                            detail: {
                                Error: 'The denominator cannot be zero'
                            }
                        }
                    };
                } else if (a <= 0 || b <= 0 || args == null) {
                    throw {
                        Fault: {
                            faultcode: '500',
                            faultstring: 'Invalid input parameters',
                            detail: {
                                Error: 'The parameters must be positive integers and not null'
                            }
                        }
                    };
                } else {
                    var n = a / b;
                    return {
                        res: n
                    };
                }
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