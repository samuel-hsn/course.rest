const express = require("express");
const bodyParser = require("body-parser");
const packageJson = require("../package.json");

class App {
  constructor(places, files, users) {
    const app = express();

    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json({ type: ['json', '+json'] }));

    var middlewareHttp = function(request, response, next) {
      response.setHeader("Accept", "application/json");
      response.setHeader("Api-version", packageJson.version);
      response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
      response.setHeader("Access-Control-Allow-Headers", "my-header-custom, Content-Type");

      if (request.method === 'GET') {
        response.setHeader("Cache-Control", "private, max-age=15");
      } else if (request.method === 'OPTIONS') {
        response.setHeader("Cache-Control", "private, max-age=30");
      }

      console.log(`${request.method} ${request.originalUrl}`);
      if (request.body && Object.keys(request.body).length > 0) {
        console.log(`request.body ${JSON.stringify(request.body)}`);
      }
      next();
    };
    app.use(middlewareHttp);

    if (files) {
      files.configure(app);
    }
    if (places) {
      places.configure(app);
    }
    if (users) {
      users.configure(app);
    }

    app.get("/api/version", function(request, response) {
      response.json({
        version: packageJson.version
      });
    });

    var middleware404 = function(request, response) {
      response.json({
        key: "not.found"
      });
    };
    app.use(middleware404);

    // eslint-disable-next-line no-unused-vars
    app.use(function(error, request, response, next) {
      console.error(error.stack);
      response.status(500).json({
        key: "server.error"
      });
    });

    this.app = app;
  }
}

module.exports = App;
