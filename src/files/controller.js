const { v1: uuidv1 } = require('uuid');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

class Files {
  constructor() {}

  configure(app) {
    app.use(fileUpload());

    const uploadDir = path.join(__dirname, "/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    app.post("/api/files", (request, response) => {
      if (!request.files || !request.files.image) {
        return response.status(400).send("No files were uploaded.");
      }
      let file = request.files.image;
      let id = uuidv1();
      var filename = id + "_" + file.name;
      let filePath = path.join(uploadDir, filename);
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
      response.sendFile(path.join(uploadDir, filename));
    });
  }
}

module.exports = Files;
