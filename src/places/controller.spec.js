const request = require("supertest");
const App = require("../app");
const PlaceData = require("./data");
const Place = require("./controller");


describe("Places/controller", () => {
  it("GET /api/places/2 should respond a http 200 OK", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places/2")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.author).toBe("Louis");
      });
  });

  it("GET /api/places/youhou should respond a http 404", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places/youhou")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(response => {
        expect(response.body.key).toBe("entity.not.found");
      });
  });

  it("GET /api/places should respond with the number of places", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places/all")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(response => {
        const placesInDataJson = require("./data.json").places;
        expect(response.body).toBe(placesInDataJson.length); // Vérifie la taille du tableau
      });
  });

  it('POST /api/places should respond a http 201 OK with no image', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(201);
    });

    it('POST /api/places should respond a http 201 OK with an image', () => {

        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'bworld place'
            }
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(201);

    });

    it('POST /api/places should respond a http 400 KO', () => {

        var newPlace = {
            name: '',
            author: 'Pat',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('POST /api/places should respond a http 400 KO', () => {

        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Londre &',
            author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'tgt'
            }
        };
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('DELETE /api/places/2 should respond a http 200 OK', () => {
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
          .delete('/api/places/2')
          .expect(200)
          .then(response => {
              expect(response.body.response).toBe('Object succesfully deleted');
          });
    });

    // Nouveau test pour la tentative de suppression d'une place non existante
    it('DELETE /api/places/999 should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/999')
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.error).toBe('Place not found');
            });
    });

     // Cas 1 : Place trouvée et données valides
    it('PUT /api/places/:id should replace a place with valid data', () => {
      let id = 1;
      const app = new App(new Place(new PlaceData())).app;
      const updatedPlace = {
        name: 'Paris Updated',
        author: 'Jean Updated',
        review: 8
      };
      return request(app)
        .put(`/api/places/${id}`)
        .send(updatedPlace)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => {
          expect(response.body.id).toBe("1");
        });
    });

    // Cas 2 : Place trouvée et données non valides
    it('PUT /api/places/:id should respond with 404 for invalid data', () => {
      let id = 1;
      const invalidPlace = {
        name: 'Pa', // Invalid name
        author: 'J', // Invalid author
        review: 20 // Invalid review
      };
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put(`/api/places/${id}`)
        .send(invalidPlace)
        .expect('Content-Type', /json/)
        .expect(400)
        .expect(response => {
          expect(response.body.error).toEqual(expect.any(String));
        });
    });

    // Cas 3 : Place non trouvée
    it('PUT /api/places/:id should respond with 404 for non-existent place', () => {
      const updatedPlace = {
        name: 'NonExistent Place',
        author: 'NonExistent Author',
        review: 5
      };
        const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put(`/api/places/999`)
        .send(updatedPlace)
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(response => {
          expect(response.body.key).toBe("entity.not.found");
        });
    });

    // Cas 4 : Mise à jour partielle de la place
    it('PUT /api/places/:id should update only specified properties', () => {
      let id = 1;
      const partialUpdate = {
        name: 'Paris Partially Updated'
      };
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put(`/api/places/${id}`)
        .send(partialUpdate)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response => {
          expect(response.body.id).toBe("1");
        });
      });    

      // Cas 1 : Place trouvée et données valides
      it('PATCH /api/places/:id should replace a place with valid data', () => {
        let id = 1;
        const patches = [
          { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
          { "op": "replace", "path": "/author", "value": "Robert" }
        ];
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .patch(`/api/places/${id}`)
          .send(patches)
          .expect('Content-Type', /application\/json-patch\+json/)
          .expect(200)
          .expect(response => {
            expect(response.body.id).toBe("1");
          });
      });

      // Cas 2 : Place trouvée et données non valides
      it('PATCH /api/places/:id should respond with 400 for invalid data', () => {
        let id = 1;
        const patches = [
          { "op": "replace", "path": "/name", "value": "P" },
          { "op": "replace", "path": "/review", "value": 15 } // Invalid review value
        ];
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .patch(`/api/places/${id}`)
          .send(patches)
          .expect('Content-Type', /application\/json-patch\+json/)
          .expect(400)
          .expect(response => {
            expect(typeof response.body.error).toBe('string');
          });
      });

      // Cas 3 : Place non trouvée
      it('PATCH /api/places/:id should respond with 404 for non-existent place', () => {
        const patches = [
          { "op": "replace", "path": "/name", "value": "NonExistent Place" },
          { "op": "replace", "path": "/author", "value": "NonExistent Author" }
        ];
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .patch(`/api/places/999`)
          .send(patches)
          .expect('Content-Type', /application\/json-patch\+json/)
          .expect(404)
          .expect(response => {
            expect(response.body.key).toBe('entity.not.found');
          });
      });

      it('GET http://localhost:8081/api/places/list/char?name=gan should respond with 200 for existent place', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .get(`/api/places/list/char?name=gan`)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(response => {
            expect(response.body).toEqual([{
              id: '3',
              name: 'Ploufragan',
              author: 'Guillaume',
              review: 3,
              image: {
                title: 'Lieu naturel',
                url: 'http://localhost:8081/api/files/7577fcc0-0580-11e7-a2b8-5dcb02604871_hackathon.PNG'
              }
            }]);
          });
      });

      it('GET http://localhost:8081/api/places/list/char?name=gan should respond with 200 for existent place', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .get(`/api/places/list/char?name=ganfefefefefeffef`)
          .expect('Content-Type', /json/)
          .expect(200)
          .expect(response => {
            expect(response.body).toEqual([]);
          });
      });

      
});
