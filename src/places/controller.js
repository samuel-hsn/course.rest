const { Validator } = require('jsonschema');
const jsonpatch = require('fast-json-patch');

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
      const queryName = request.query.name;
      const places = await data.getPlacesAsync();

      if (places !== undefined) {
        if (queryName) {
          const regex = new RegExp(queryName, 'i');
          const tabPlaceByName = [];
          for (const place of places) {
            if (regex.test(place.name)){
              tabPlaceByName.push(place);
            }
          }
          response.status(200).json(tabPlaceByName);
        } else {
          response.status(200).json(places.length);
        }
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });
    
    app.post("/api/places", async (request, response) => {
      let place = request.body;

      // Schéma de validation pour un objet place
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

      // Création d'un validateur
      const v = new Validator();
      const validation = v.validate(place, placeSchema);

      // Si la validation échoue, renvoyer une erreur 400
      if (validation.errors.length > 0) {
        response.status(400).json({
          key: "validation.error",
          errors: validation.errors.map(error => error.stack)
        });
        return;
      }

      // Enregistrement de la place si la validation réussit
      const id = await data.savePlaceAsync(place);
      response.setHeader("Location", `http://localhost:8081/places/${id}`);
      response.status(201).json();
    });

    app.delete("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place === undefined) {
        response.status(404).json({ key: "entity.not.found" });
        return;
      }

      await data.deletePlaceAsync(id);
      response.status(204).send();
    });

    app.put("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      let newPlace = request.body;
      const placeById = await data.getPlaceAsync(id);

      //la place ayant cette Id n'a pas été trouvé
      if (placeById === undefined) {
        response.status(404).json({ key: "entity.not.found" });
        return;
      }
      
      // Schéma de validation pour un objet place
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

      // Création d'un validateur
      const v = new Validator();
      const validation = v.validate(newPlace, placeSchema);
      
      // Si la validation échoue, renvoyer une erreur 400
      if (validation.errors.length > 0) {
        response.status(400).json({
          key: "validation.error",
          errors: validation.errors.map(error => error.stack)
        });
        return;
      }

      // Enregistrement de la place si la validation réussit
      newPlace.id = id;
      id = await data.savePlaceAsync(newPlace);
      response.setHeader("Location", `http://localhost:8081/places/${id}`);
      response.status(200).json(newPlace);
    });

    app.patch("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      let informationAModifier = request.body;

      const placeById = await data.getPlaceAsync(id);

      //la place ayant cette Id n'a pas été trouvé
      if (placeById === undefined) {
        response.status(404).json({ key: "entity.not.found" });
        return;
      }
      
      //Patch avec json
      let newPlace = Object.assign(placeById,informationAModifier);

      //Patch avec jsonpatch
      //let newPlace = jsonpatch.applyPatch(placeById, informationAModifier).newDocument;
  
      // Schéma de validation pour un objet place
      var placeSchema = {
        "id": "/Place",
        "type": "object",
        "properties": {
          "image": {
            "oneOf": [
            {
              "type": "object",
              "properties": {
                "url": {"type": "string",  "pattern": "(https|http):?:\/\/.*"},
                "title": {"type": "string", "minLength": 3, "maxLength": 100}
              },
              "required": ["url", "title"]
            },
            {
              "type": "null"
            }
          ]
        },
          "author": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'},
          "review": {"type": "integer", "minimum": 1, "maximum": 9},
          "name": {"type": "string", "minLength": 3, "maxLength": 100, pattern:'^[a-zA-Z -]*$'}
        },
        "required": ["author", "review", "name"]
      };

      // Création d'un validateur
      const v = new Validator();
      const validation = v.validate(newPlace, placeSchema);
      
      // Si la validation échoue, renvoyer une erreur 400
      if (validation.errors.length > 0) {
        response.status(400).json({
          key: "validation.error",
          errors: validation.errors.map(error => error.stack)
        });
        return;
      }

      // Enregistrement de la place si la validation réussit
      newPlace.id = id;
      id = await data.savePlaceAsync(newPlace);
      response.setHeader("Location", `http://localhost:8081/places/${id}`);
      response.status(200).json(newPlace);
    });
  }
}
module.exports = Places;
