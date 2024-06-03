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
          "review": {"type": "integer", "minimum": 1, "maximum": 9},
          "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
        },
        "required": ["author", "review", "name"]
      };

      /*const place = request.body;
      const id = await data.savePlaceAsync(place);
      response.setHeader("Location", `/api/places/${id}`);
      response.status(201).send();*/
    });


  }
}
module.exports = Places;
