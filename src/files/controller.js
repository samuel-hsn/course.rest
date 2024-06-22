const { v1: uuidv1 } = require("uuid");
const fileUpload = require("express-fileupload");
const path = require("path");

class Files {
  constructor() {}
  configure(app) {
    app.use(fileUpload());
    
    app.post("/api/files", (request, response) => {
      if (!request.files) {
        return request.status(400).send("No files were uploaded.");
      }
      let file = request.files.image; // to send a file in the request, the key must be 'image'
      console.log(file);
      let id = uuidv1();
      var filename = id + "_" + file.name;
      let filePath = path.join(__dirname, "/uploads", filename);
      console.log(filePath);
      file.mv(filePath, function(err) {
        if (err) {
          return response.status(500).send(err);
        }
        response.setHeader("Location", `/api/files/${filename}`);
        response.json({
          id: id,
          filename: filename
        });
      });
    });

    app.get("/api/files/:filename", function(request, response) {
      let filename = request.params.filename;
      response.sendFile(path.join(__dirname, "/uploads", filename));
    });
  }
}
module.exports = Files;
