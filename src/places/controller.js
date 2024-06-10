const jsonpatch = require('fast-json-patch');

class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;

    //Validator JSON qui vérifie que les données envoyées dans les requêtes POST sont bien au format attendu
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

    //Requête GET qui renvoie la liste des places
    app.get("/api/places", async (request, response) => {
      const places = await data.getPlacesAsync();
      if (places !== undefined) {
        response.status(200).json(places);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    //Requête GET qui renvoie une place en fonction de son id
    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    });

    //Requête POST qui permet d'ajouter une place
    app.post("/api/places", async (request, response) => {
      const place = request.body;
      var result = v.validate(place, placeSchema);
      if (result.errors.length > 0) {
        response.status(400).json({key: "invalid.data"});
        return;
      }
      const id = await data.savePlaceAsync(place);
      response.status(201).header("Location", `/api/places/${id}`).send();
    });

    //Requête DELETE qui permet de supprimer une place en fonction de son id
    app.delete("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const res = await data.deletePlaceAsync(id);
      if (res) {
        response.status(200).json({key: "entity.deleted"});
        return;
      }
      response.status(404).json({key: "entity.not.found"});
    }); 

    //Requête PUT qui permet de modifier une place en fonction de son id
    app.put("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      
      //place inexistant
      const places = await data.getPlaceAsync(id);
      if(places === undefined){
        response.status(404).json({key: "entity.not.found"});
        return;
      }
      const place = request.body;
      place.id = id;
      var result = v.validate(place, placeSchema);
      //données invalides
      if (result.errors.length > 0) {
        response.status(400).json({key: "invalid.data"});
        return;
      }
      const res = await data.savePlaceAsync(place);
      response.status(200).json({key: "entity.updated"});
    });

    //Requête PATCH qui permet de modifier PARTEILLEMENT une place en fonction de son id
    app.patch("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      
      //place inexistant
      const placeOld = await data.getPlaceAsync(id);
      if(placeOld === undefined){
        response.status(404).json({key: "entity.not.found"});
        return;
      }

      //use either JSON Patch or Object.assign
      var key;
      var place;
      if(request.is("application/json-patch+json")==="application/json-patch+json"){
      //   key="entity.updated.jsonpatch";
        
      //   var patch = request.body;
      //   place = jsonpatch.applyPatch(placeOld, patch).newDocument;

      } 
      else {
        key="entity.updated";
        // if (Array.isArray(request.body)){
        //   response.status(400).json({key: "invalid.data"});
        //   return;
        // }
        place = Object.assign(placeOld,request.body);
        
      }
      //place.id = id;

      var result = v.validate(place, placeSchema);
      //données invalides
      if (result.errors.length > 0) {
        response.status(400).json({key: "invalid.data"});
        return;
      }
      const res = await data.savePlaceAsync(place);
      response.status(200).json({key: key});
    });
  }
}
module.exports = Places;
