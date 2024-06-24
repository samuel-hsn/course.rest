const express = require('express');
const bodyParser = require('body-parser');
const packageJson = require('../package.json');

class App {
    constructor(place, files) {
        const app = express();

        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json({type:'application/*'}));

        var middlewareHttp = function (request, response, next) {
            response.setHeader('Api-version', packageJson.version);
            response.setHeader('Content-Type', 'application/json');
            response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'content-type, my-header-custom, Location');
            if (request.method === 'GET') response.setHeader('Cache-Control', 'max-age=15');
            if (request.method === 'OPTIONS') response.setHeader('Cache-Control', 'max-age=30');

            console.log(`${request.method} ${request.originalUrl}`);
            if (request.body && Object.keys(request.body).length >0) {
                console.log(`request.body ${JSON.stringify(request.body)}`);
            }
            next();
        };
        app.use(middlewareHttp);

        if(files!==undefined) files.configure(app);
        place.configure(app);

        app.get('/api/version', function (request, response) {
            response.json({
                version: packageJson.version
            });
        });

        // app.post('/api/login', function (request, response) {
        //     const body = request.body;
        //     if (body.username === 'admin' && body.password === 'admin') {
        //         response.status(200)
        //     }
        //     else {
        //         response.status(401).json({
        //             key: 'login.failed'
        //         });
        //     }


        app.get('/api/*', function (request, response) {
            response.status(404).json({
                key: 'not.found'
            });
        });
        

        // eslint-disable-next-line no-unused-vars
        app.use(function (error, request, response, next) {
            console.error(error.stack);
            response.status(500).json({
                key: 'server.error'
            });
        });
        this.app=app;
    }
}

module.exports = App;
