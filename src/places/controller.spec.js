const request = require("supertest");
const App = require("../app");
const PlaceData = require("./data");
const Place = require("./controller");

describe("Places/controller", () => {

    const data = new PlaceData();
  
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

  //TODO Ajouter ici le test qui vérifie le nombre de place remonté par l'api
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
                title: ''
            }
        };
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);
    });

// DELETEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

    // Nouveau test pour la suppression réussie
    it('DELETE /api/places/2 should respond a http 200 OK', () => {
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
          .delete('/api/places/2')
          .expect(200)
          .then(response => {
              expect(response.body.message).toBe('Place deleted successfully');
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
                expect(response.body.key).toBe('entity.not.found');
            });
    });

// REMPLACEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

    it('PUT /api/places/2 should respond with http 200 OK and updated place', () => {
      const updatedPlace = {
        name: 'New Place Name',
        author: 'New Author',
        review: 5,
        image: {
          url: 'https://example.com/new-image.jpg',
          title: 'New Image Title'
        }
      };
  
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put('/api/places/2')
        .send(updatedPlace)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
          expect(response.body.name).toBe(updatedPlace.name);
          expect(response.body.author).toBe(updatedPlace.author);
          expect(response.body.review).toBe(updatedPlace.review);
          expect(response.body.image).toEqual(updatedPlace.image);
        });
    });
  
    it('PUT /api/places/999 should respond with http 404 Not Found', () => {
      const updatedPlace = {
        name: 'New Place Name',
        author: 'New Author',
        review: 5,
        image: {
          url: 'https://example.com/new-image.jpg',
          title: 'New Image Title'
        }
      };
  
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put('/api/places/999')
        .send(updatedPlace)
        .expect('Content-Type', /json/)
        .expect(404)
        .expect(response => {
          expect(response.body.key).toBe('entity.not.found');
        });
    });
  
    it('PUT /api/places/2 with invalid data should respond with http 400 Bad Request', () => {
      const updatedPlace = {
        name: '',
        author: 'New Author',
        review: 5,
        image: {
          url: 'https://example.com/new-image.jpg',
          title: 'New Image Title'
        }
      };
  
      const app = new App(new Place(new PlaceData())).app;
      return request(app)
        .put('/api/places/2')
        .send(updatedPlace)
        .expect('Content-Type', /json/)
        .expect(400);
    });

// MISE A JOURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR

    it('PUT /api/places/2 should update only the provided properties', async () => {
        const updatedProperties = {
        name: 'Paris'
        };
    
        const app = new App(new Place(new PlaceData())).app;
        const originalPlace = await data.getPlaceAsync(2);
    
        return request(app)
        .put('/api/places/2')
        .send(updatedProperties)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(async response => {
            const updatedPlace = await data.getPlaceAsync(2);
            
            // Vérifie que seules les propriétés fournies ont été mises à jour
            expect(updatedPlace.name).toBe(updatedProperties.name);
            expect(updatedPlace.author).toBe(originalPlace.author);
            expect(updatedPlace.review).toBe(originalPlace.review);
            expect(updatedPlace.image).toEqual(originalPlace.image);
        });
    });

// 13 MISE A JOURRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR

    it('PATCH /api/places/2 should update properties using JSON Patch', async () => {
        const jsonpatch = [
          { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
          { "op": "replace", "path": "/author", "value": "Robert" }
        ];
      
        const app = new App(new Place(data)).app;
        const originalPlace = await data.getPlaceAsync(2);
      
        return request(app)
          .patch('/api/places/2')
          .send(jsonpatch)
          .expect('Content-Type', /json/)
          .expect(200)
          .then(async response => {
            const updatedPlace = await data.getPlaceAsync(2);
            
            // Vérifie que les propriétés name et author ont été mises à jour
            expect(updatedPlace.name).toBe('Saint-brieuc');
            expect(updatedPlace.author).toBe('Robert');
            
            // Vérifie que les autres propriétés sont restées inchangées
            expect(updatedPlace.review).toBe(originalPlace.review);
            expect(updatedPlace.image).toEqual(originalPlace.image);
          });
    });
});
