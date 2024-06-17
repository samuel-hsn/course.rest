const jsonpatch = require('fast-json-patch');


class Places {
  constructor(data) {
    this.data = data;
  }
  configure(app) {
    const data = this.data;


    app.get("/api/places/list", async (request, response) => {
      const places = await data.getPlacesAsync();
      response.status(200).json(places);
    });    


    app.get('/api/places/list/char', async (request, response) => {
      const { name } = request.query;
    
      if (!name) {
        return response.status(400).json({ error: 'Le paramètre de requête "name" est requis.' });
      }
    
      try {
        // Récupérer toutes les places
        const places = await data.getPlacesAsync();
    
        // Filtrer les places dont le nom contient la chaîne spécifiée (insensible à la casse)
        const filteredPlaces = places.filter(place => {
          const regex = new RegExp(name, 'i');
          return regex.test(place.name);
        });
    
        response.status(200).json(filteredPlaces);
      } catch (error) {
        console.error('Erreur lors du filtrage des places :', error);
        response.status(500).json({ error: 'Erreur serveur lors du filtrage des places.' });
      }
    });
    
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
      response.status(404).json({key: "entity.not.found"});
    });

    app.post("/api/places", async (request, response) => {
      try {
        const newPlace = request.body;
        const id = await data.savePlaceAsync(newPlace);
        response.status(201).header('Location', `/api/places/${id}`).json({ id });
      } catch (err) {
        response.status(400).json({ error: err.message });
      }
    });

    app.delete("/api/places/:id", async (request, response) => {
      try {
        const id = request.params.id; // Lire l'ID depuis les paramètres de l'URL
        const success = await data.deletePlaceAsync(id);
        if (success) {
          response.status(200).send({response: 'Object succesfully deleted'}); // 204 No Content
        } else {
          response.status(404).json({ error: 'Place not found' }); // 404 Not Found si l'ID n'existe pas
        }
      } catch (err) {
        response.status(400).json({ error: err.message }); // 400 Bad Request en cas d'erreur
      }
    });

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
    
   app.patch("/api/places/:id", async (request, response) => {
      try {
        let placeId = request.params.id;
        const patches = request.body;    


        const existingPlace = await data.getPlaceAsync(placeId);

        if (!existingPlace) {
          return response.status(404).header('Content-Type', 'application/json-patch+json').json({ key: "entity.not.found" });
        }
    
        // Utiliser JsonPatch pour mettre à jour les propriétés
        const updatedPlace = jsonpatch.applyPatch(existingPlace, patches).newDocument;
        
        if (updatedPlace.image === null) {
          delete updatedPlace.image;
        }
        // Valider les données mises à jour
        await data.savePlaceAsync(updatedPlace);
        response.status(200).header('Content-Type', 'application/json-patch+json').json({id : placeId});
      } catch (err) {
        response.status(400).header('Content-Type', 'application/json-patch+json').json({ error: err.message });
      }
    });
    
  }
}
module.exports = Places;
