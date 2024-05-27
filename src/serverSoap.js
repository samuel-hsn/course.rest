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
                console.log('divisar called');
                console.log(args);
                if(args.a > 0 && args.b > 0 && args != null){
                    var n = parseInt(args.a) / parseInt(args.b);
                    return {
                     res: n
                };
                }
                else{
                    // return {
                    //     res: "On ne peut pas diviser par 0 ou des valeurs inférieures à 0" 
                    // };
                    /*
                    Erreur voulu pour tester le code
                    Code : 500
                    Reason : b cannot be 0
                    */
                    throw  {
                        Fault: {
                            faultcode: "500",
                            faultstring: "b cannot be 0",
                            detail: "On ne peut pas diviser par 0 ou des valeurs inférieures à 0"
                        }
                    }
                }
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