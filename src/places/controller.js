const { Validator } = require('jsonschema');

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
      response.status(200).json(places.length);
    });

    app.post("/api/places", async (request, response) => {
      const validator = new Validator();
      const place = request.body;
      
      const validation = validator.validate(place, placeSchema);
      if (!validation.valid) {
        return response.status(400).json({
          errors: validation.errors.map(error => error.stack)
        });
      }

      const id = await data.savePlaceAsync(place);
      response.location("/places/" + id).status(201).send();
    });

    app.delete("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        await data.deletePlaceAsync(id);
        response.status(204).send();
      } else {
        response.status(404).json({ key: "entity.not.found" });
      }
    });


    // PUT MODIFIER UNE PLACE ENTIEREMENT
    // app.put("/api/places/:id", async (request, response) => {
    //   const validator = new Validator();
    //   const place = request.body;
    //   const id = request.params.id;
    
    //   // Validation de la place avec le schéma
    //   const validation = validator.validate(place, placeSchema);
    //   if (!validation.valid) {
    //     return response.status(400).json({
    //       errors: validation.errors.map(error => error.stack)
    //     });
    //   }
    
    //   // Vérifier si la place existe
    //   const existingPlace = await data.getPlaceAsync(id);
    //   if (!existingPlace) {
    //     return response.status(404).json({ key: "entity.not.found" });
    //   }
    
    //   // Mettre à jour la place entièrement 
    //   place.id = id; // Assurez-vous que l'ID de la place est celui fourni dans l'URL
    //   await data.savePlaceAsync(place);
    
    //   // Réponse avec un statut 204 pour indiquer que la mise à jour a été effectuée avec succès
    //   response.status(204).send();
    // });

    // PUT MODIFIER UNE PLACE PARTIELLEMENT

  //   app.put("/api/places/:id", async (request, response) => {
  //     const validator = new Validator();
  //     const place = request.body;
  //     const id = request.params.id;
  
  //     // Validation de la place avec le schéma
  //     const validation = validator.validate(place, placeSchema);
  //     if (!validation.valid) {
  //       return response.status(400).json({
  //         errors: validation.errors.map(error => error.stack)
  //       });
  //     }
  //     // Vérifier si la place existe
  //     const existingPlace = await data.getPlaceAsync(id);
  //     if (!existingPlace) {
  //       return response.status(404).json({ key: "entity.not.found" });
  //     }
  //     const updatedPlace = Object.assign({}, existingPlace, place);
  
  //     // Mettre à jour la place
  //     await data.savePlaceAsync(updatedPlace);
  //     // Retourner la place mise à jour avec le statut 200
  //     response.status(200).json(updatedPlace);
  // });
  
    
    app.patch("/api/places/:id", async (request, response) => {
      const validator = new Validator();
      const placeUpdates = request.body;
      const id = request.params.id;
    
      // Vérifier si la place existe
      const existingPlace = await data.getPlaceAsync(id);
      if (!existingPlace) {
        return response.status(404).json({ key: "entity.not.found" });
      }
    
      // Fusionner les propriétés mises à jour avec la place existante
      const updatedPlace = Object.assign({}, existingPlace, placeUpdates);
      
      // Mettre à jour la place
      await data.savePlaceAsync(updatedPlace);
    
      // Réponse avec un statut 204 pour indiquer que la mise à jour a été effectuée avec succès
      response.status(204).type('application/json').send();
    });
      
  }

}
module.exports = Places;
