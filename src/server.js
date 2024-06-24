const App = require("./app");

const Places = require("./places/controller");
const Data = require("./places/data");
const Files = require("./files/controller");
const Users = require("./users/login/controller");
const User_data = require("./users/login/data");

const files = new Files();
const places = new Places(new Data());
const users = new Users(new User_data());

const app = new App(places, files, users).app;

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});
