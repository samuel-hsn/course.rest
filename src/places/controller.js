const { applyPatch } = require('fast-json-patch');
const Validation = require('./validation.js');
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
      response.status(404).json({ key: "entity.not.found" });
    });

    ////
    app.get("/api/places", async (request, response) => {
      const places = await data.getPlacesAsync();
      response.status(200).json(places);
    });

    app.post("/api/places", async (request, response) => {
      const place = request.body;
      var res = new Validation().validatePlace(place);
      if (res.valid) {
        const id = await data.savePlaceAsync(place);
        response.location(`/api/places/${id}`).status(201).end();
        return;
      }
      response.status(400).json({ key: "bad.request", data: res.errors });
    });
    ////

    //// delete
    app.delete("/api/places/:id", async (request, response) => {
      let id = request.params.id;
      const place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        await data.deletePlaceAsync(id);
        response.status(204).end();
        return;
      }
      response.status(404).json({ key: "entity.not.found" });
    });

    //// update
    app.put("/api/places/:id", async (request, response) => {
      var newPlace = request.body;
      let id = request.params.id;
      var res = new Validation().validatePlace(newPlace);
      if (res.valid) {
        newPlace.id = request.params.id;
        const place = await data.getPlaceAsync(id);
        if (place !== undefined) {
          await data.savePlaceAsync(newPlace);
          response.status(204).end();
          return;
        }
        response.status(404).json({ key: "entity.not.found" });
        return;
      }
      response.status(400).json({ key: "bad.request", data: res.errors });
      return;
    });

    //// update with patch TO DO / TESTER
    app.patch("/api/places/:id", async (request, response) => {
      var newPlace = request.body;
      let id = request.params.id;

      // check request header
      if (request.headers['content-type'] !== 'application/json-patch+json') {
        // without json patch
        var res = new Validation().validatePlace(newPlace, { skipAttributes: ['required'] }); // required pose probleme
        if (res.valid) {
          const place = await data.getPlaceAsync(id);
          if (place !== undefined) {
            Object.assign(place, newPlace);
            await data.savePlaceAsync(place);
            response.status(204).end();
            return;
          }
          response.status(404).json({ key: "entity.not.found" });
          return;
        }
        response.status(400).json({ key: "bad.request", data: res.errors });
        return;
      }

      // with json patch
      var place = await data.getPlaceAsync(id);
      if (place !== undefined) {
        const result = jsonpatch.applyPatch(place, newPlace, true);
        if (result) {
          await data.savePlaceAsync(place);
          response.status(204).end();
          return;
        }
        response.status(400).json({ key: "bad.request" });
        return;
      }
      response.status(404).json({ key: "entity.not.found" });
      return;
    });
  }
}
module.exports = Places;
