const Validator = require('jsonschema').Validator;
const { applyOperation } = require('fast-json-patch');
const v = new Validator();

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
      place.comments = `/api/places/${id}/comments`;
      response.status(200).json(place);
      return;
      }
      response.status(404).json({key: "entity.not.found"});
    });
    
    app.get("/api/places", async (request, response) => {
      const places = await data.getPlacesAsync();
      const query = request.query.name;
      if (query) {
        const filteredPlaces = places.filter(place => place.name.toLowerCase().includes(query.toLowerCase()));
        response.status(200).json({ data: filteredPlaces });
      } else {
        const placesWithComments = places.map(place => {
          return {
            ...place,
            comments: `/api/places/${place.id}/comments`
          };
        });
        response.status(200).json({ data: placesWithComments });
      }
    });
    
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

    app.post("/api/places", async (request, response) => {
      const placeData = request.body;
      const validationResult = v.validate(placeData, placeSchema);
      if (!validationResult.valid) {
        response.status(400).json({ error: validationResult.errors });
        return;
      }

      if (placeData.image)
      if (placeData.image.title && !placeData.image.url) {
        response.status(400).json({ error: "Image URL is required when image title is provided" });
        return;
      }

      const newPlace = await data.savePlaceAsync(placeData);
      response.status(201).location('/api/places').send();
    });

    app.delete("/api/places/:id", async (request, response) => {
      const id = request.params.id;
      const place = await data.deletePlaceAsync(id);
      if (place !== undefined) {
        response.status(204).json(place);
        return;
      }
    });

    app.put("/api/places/:id", async (request, response) => {
      const id = request.params.id;

      const place = await data.getPlaceAsync(id);
      if (place === undefined) {
        response.status(404).json({key: "not.found"});
        return;
      }

      const placeData = request.body;
      const validationResult = v.validate(placeData, placeSchema);
      if (!validationResult.valid) {
        response.status(400).json({ error: validationResult.errors });
        return;
      }

      if (placeData.image)
      if (placeData.image.title && !placeData.image.url) {
        response.status(400).json({ error: "Image URL is required when image title is provided" });
        return;
      }

      placeData.id = id;
      await data.savePlaceAsync(placeData);
      response.status(202).json(placeData);
    });

    app.patch("/api/places/:id", async (request, response) => {
      const id = request.params.id;

      const place = await data.getPlaceAsync(id);
      if (place === undefined) {
        response.status(404).json({key: "not.found"});
        return;
      }

      const placeData = request.body;

      if (request.headers['content-type'] === 'application/json-patch+json') {
        const patch = placeData;
        const updatedPlace = applyOperation(place, patch);
        await data.savePlaceAsync(updatedPlace);
        response.status(202).json(updatedPlace);
        return;
      } else {
        if (placeData.image != undefined)
          place.image = placeData.image;
        if (placeData.author != undefined)
          place.author = placeData.author;
        if (placeData.review != undefined)
          place.review = placeData.review;
        if (placeData.name != undefined)
          place.name = placeData.name;

        await data.savePlaceAsync(place);
        response.status(202).json(place);
      }
    });

  }
}
module.exports = Places;
