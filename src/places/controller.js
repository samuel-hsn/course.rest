const { request, response } = require('express');
const jsonPatch = require('fast-json-patch');

class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

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
          "review": {"type": "integer", "minimum": 1, "maximum": 9},
          "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
          },
          "required": ["author", "review", "name"]
      };

    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    app.get("/api/places", async(request, response) => {
      const places = await data.getPlacesAsync();
      if(places !== undefined) {
        response.status(200).json(places);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    app.post("/api/places", async(request, response) => {
      const instance = request.body;
      const validation = v.validate(instance, placeSchema);
      
      if(validation.valid == 0) {
        response.status(400).json({key: "KO"});
        return;
      } else {
        const id_place = await data.savePlaceAsync(instance);
        if(id_place !== undefined) {
          response.set('Location', '/api/places/');
          response.status(201).json({key: "OK"});
          return;
        }
      }
    });

    app.delete("/api/places/:id", async(request, response) => {
      let id = request.params.id;
      const res = await data.deletePlaceAsync(id);

      if(res) {
        response.set('Location', '/api/places');
        response.status(200).json({key: "OK"});
        return;
      } else {
        response.status(404).json({key: "KO"});
      }
    });

    app.put("/api/places/:id", async(request, response) => {
      let id = request.params.id;
      const instance = request.body;
      const validation = v.validate(instance, placeSchema);

      if (validation.valid == 0) {
        response.status(400).json({ key: "invalid.request" });
        return;
      }

      try {
        const place = await data.getPlaceAsync(id);

        if(place == undefined) {
          response.status(404).json({key: "entity.not.found"});
          return;
        }

        const res = await data.savePlaceAsync(place);
        response.status(200).json(res);
        return;
      } catch (error) {
        console.error(error);
        response.status(500).json({ key: 'internal.server.error' });
        return;
      }
    });

    /* app.patch("/api/places/:id", async(request, response) => {
      let id = request.params.id;
      const data_request = request.body;

      try {
        const place = await data.getPlaceAsync(id);

        if(place == undefined) {
          response.status(404).json({ key: "entity.not.found" });
          return;
        }

        const updated_places = Object.assign(place, data_request);
        const res = await data.savePlaceAsync(updated_places);
        response.status(200).json(res /* updated_places */ /*);
        return;
        
      } catch (error) {
        console.error(error);
        response.status(500).json({ key: 'internal.server.error' });
        return;
      }
    }); */

    app.patch("/api/places/:id", async(request, response) => {
      let id = request.params.id;
      const patch = request.body;

      try {
        const place = await data.getPlaceAsync(id);

        if(place == undefined) {
          response.status(404).json({ key: "entity.not.found" });
          return;
        }

        const patched_place = jsonPatch.applyPatch(place, patch).newDocument;
        const res = await data.savePlaceAsync(patched_place);
        response.status(200).json(patched_place);
        return;

      } catch (error) {
        console.error(error);
        response.status(500).json({ key: 'internal.server.error' });
        return;
      }
    });

    app.get("/api/places?name=:name", async(request, response) => {
      let name = request.query[name];

      try {
        
      } catch (error) {
        
      }
    })
    
  }
}
module.exports = Places;
