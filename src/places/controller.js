const jsonpatch = require('fast-json-patch');

class Places {
  constructor(data) {
    this.data = data;
  }

  configure(app) {
    const data = this.data;

    app.get("/api/places/all", async (request, response) => {
      const places = await data.getPlacesAsync();
      response.status(200).json(places.length);
    });

    app.get("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        response.status(200).json(place);
        return;
      }
      response.status(404).json({ key: "entity.not.found" });
    });

    // Nouvelle route pour ajouter une place
    app.post("/api/places", async (request, response) => {
      const newPlace = request.body;
      try {
        const createdPlace = await data.savePlaceAsync(newPlace);
        response.status(201).json(createdPlace);
      } catch (error) {
        response.status(400).json({ key: "entity.creation.failed", message: error.message });
      }
    });

    // Nouvelle route pour supprimer une place
    app.delete("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      try {
        const result = await data.deletePlaceAsync(id);
        if (result) {
          response.status(200).json({ message: "Place deleted successfully" });
        } else {
          response.status(404).json({ key: "entity.not.found" });
        }
      } catch (error) {
        response.status(500).json({ key: "entity.deletion.failed", message: error.message });
      }
    });

    // Mise à jour des propriétés d'une place
    app.put("/api/places/:id", async (request, response) => {
      try {
        const placeId = request.params.id;
        const updates = request.body;
        
        // Convertir l'ID en string
        updates.id = placeId.toString();
    
        const existingPlace = await data.getPlaceAsync(placeId);
    
        if (!existingPlace) {
          return response.status(404).json({ key: "entity.not.found" });
        }
    
        // Utiliser Object.assign pour mettre à jour les propriétés
        const updatedPlace = Object.assign({}, existingPlace, updates);
        
        if (updatedPlace.image === null) {
          delete updatedPlace.image;
        }
        // Valider les données mises à jour
    
        await data.savePlaceAsync(updatedPlace);
        response.status(200).json({ id: placeId });
      } catch (err) {
        response.status(400).json({ error: err.message });
      }
    });

    // Mise à jour des propriétés d'une place en utilisant JSON Patch
    app.patch("/api/places/:id", async (request, response) => {
      const id = request.params.id;
      const patches = request.body;
      try {
        let place = await data.getPlaceAsync(id);
        if (!place) {
          response.status(404).json({ key: "entity.not.found" });
          return;
        }
        
        // Appliquer les opérations JSON Patch à la place existante
        const updatedPlace = jsonpatch.applyPatch(place, patches).newDocument;
        
        // Utilisation de savePlaceAsync pour mettre à jour la place
        await data.savePlaceAsync(updatedPlace);
        
        // Réponse avec la place mise à jour
        response.status(200).json(updatedPlace);
      } catch (error) {
        response.status(400).json({ key: "entity.update.failed", message: error.message });
      }
    });
  }
}

module.exports = Places;
