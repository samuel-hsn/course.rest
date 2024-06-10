class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    app.get("/api/places", async (request, response) => {
      const places = await data.getPlacesAsync();
      if (places !== undefined) {
        response.status(200).json(places);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    app.post("/api/places", async (request, response) => {
      var Validator = require('jsonschema').Validator;
      var v = new Validator();
      var placeSchema = {
        "id": "/Place",
        "type": "object",
        "properties": {
          "image": {
            "type": "object",
            "properties": {
              "url": {"type": "string",  "pattern": "(https|http):?:\/\/.*"},
              "title": {"type": "string", "minLength": 3, "maxLength": 100}
            },
            "required": ["url", "title"]
          },
          "author": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'},
          "review": {"type": "integer", "minimum": 0, "maximum": 9},
          "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
        },
        "required": ["author", "review", "name"]
      };

      var validatorResult = v.validate(request.body, placeSchema);
      if (!validatorResult.valid) {
        return response.status(400).json({
          errors: validatorResult.errors.map(error => error.stack)
        });
        
      }

      const id = await data.savePlaceAsync(request.body);

      response.setHeader("Location", `/api/places/${id}`);
      return response.status(201).send();

    });

    app.delete("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      try{
        let success = await data.deletePlaceAsync(id);
        if (!success) {
          return response.status(404).json({error: "Place not found"});
        }
      } catch (error) {
        return response.status(400).json({error: "Internal error"});
      }
      
      response.setHeader("Location", `/api/places/${id}`);
      return response.status(200).send();
    });
    
  }
}
module.exports = Places;
