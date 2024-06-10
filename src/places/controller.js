class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    var Validator = require('jsonschema').Validator;
    var v = new Validator();

    var placeSchema = {
      "id": "/Place",
      "type": "object",
      "properties": {
        "image": {
          "type": "object",
          "properties": {
            "url": { "type": "string", "pattern": "^(https|http)://.*" },
            "title": { "type": "string", "minLength": 3, "maxLength": 100 }
          },
          "required": ["url", "title"]
        },
        "author": { "type": "string", "minLength": 3, "maxLength": 100, "pattern": "^[a-zA-Z -]*$" },
        "review": { "type": "integer", "minimum": 0, "maximum": 9 },
        "name": { "type": "string", "minLength": 3, "maxLength": 100, "pattern": "^[a-zA-Z -]*$" }
      },
      "required": ["author", "review", "name"]
    };

    const data = this.data;

    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({ key: "entity.not.found" });
    });

    app.get("/api/places", async (request, response) => {
      const places = await data.getPlacesAsync();
      if (places !== undefined) {
        response.status(200).json(places);
        return;
      }
      response.status(404).json({ key: "entity.not.found" });
    });

    app.post("/api/places", async (request, response) => {

      const place = request.body;
      const validationResult = v.validate(place, placeSchema);

      if (validationResult.errors.length > 0) {
        return response.status(400).json({
          errors: validationResult.errors.map(error => error.stack)
        });
      }

      const id = await data.savePlaceAsync(place);
      response.setHeader("Location", `/api/places/${id}`);
      return response.status(201).send();
    });

    app.delete("/api/places/:id", async (request, response) => {

      const id = request.params.id; // Lire l'ID depuis les paramètres de l'URL
      const success = await data.deletePlaceAsync(id);
      if (success) {
        response.status(200).send({ response: 'Object succesfully deleted' }); // 204 No Content
      } else {
        response.status(404).json({ error: 'Place not found' }); // 404 Not Found si l'ID n'existe pas
      }
    });

    //Remplacer une place en utilisant la méthode PUT
    app.put('/api/places/:id', async (request, response) => {
        
        const { id } = request.params;
        const placeData = request.body;
        const validationResult = v.validate(placeData, placeSchema);
      
        if (validationResult.errors.length > 0) {
          return response.status(400).json({
            errors: validationResult.errors.map(error => error.stack)
          });
        }
        
        if(await data.getPlaceAsync(id) !== undefined) {
          this.data.savePlaceAsync(placeData);
          response.status(200).json({ message : 'Place updated' });
        }
        else {
          response.status(404).json({ error: 'Place not found' });
        }
    });
  }
}
module.exports = Places;

