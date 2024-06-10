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

  //TODO Ajouter ici le test qui vérifie le nombre de place remonté par l'api

  it("GET /api/places should respond a http 200 OK with the number of place", () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
        .get("/api/places")
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
            places = require("./data.json").places;
            expect(response.body).toBe(places.length);
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
                title: ''
            }
        };
        return request(app)
            .post('/api/places')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('DELETE /api/places/:id should respond a http 204 No Content when place is deleted', async () => {
        const app = new App(new Place(new PlaceData())).app;
    
        // Créer une nouvelle place pour s'assurer qu'il y a quelque chose à supprimer
        const response = await request(app)
          .post('/api/places')
          .send({
            name: 'Place to be deleted',
            author: 'Tester',
            review: 5
          })
          .expect(201);
    
        const location = response.headers.location;
        const id = location.split('/').pop();
    
        // Supprimer la place
        await request(app)
          .delete(`/api/places/${id}`)
          .expect(204);
    });

      it('DELETE /api/places/:id should respond a http 404 Not Found when place does not exist', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .delete('/api/places/nonexistent')
          .expect('Content-Type', /json/)
          .expect(404)
          .then(response => {
            expect(response.body.key).toBe("entity.not.found");
          });
    });

    it('PUT /api/places/:id should respond a http 204 OK with no image', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .put('/api/places/2')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(204);
    });

    it('PUT /api/places/:id should respond a http 204 OK with an image', () => {

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
            .put('/api/places/2')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(204);

    });

    it('PUT /api/places/:id should respond a http 400 KO', () => {

        var newPlace = {
            name: '',
            author: 'Pat',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .put('/api/places/2')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('PUT /api/places/:id should respond a http 400 KO', () => {

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
            .put('/api/places/2')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('PUT /api/places/:id should respond a http 404 KO', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .put('/api/places/99')
            .send(newPlace)
            .expect(404)
            .then(response => {
                expect(response.body.key).toBe("entity.not.found");
            });
    });  

    it('PATCH /api/places/:id should respond a http 204 OK with no image', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Ugo'
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/2')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(204);
    });

    it('PATCH /api/places/:id should respond a http 204 OK with an image', () => {

        var newPlace = {
            name: 'Londre',
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'bworld place'
            }
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/2')
            .send(newPlace)
            .expect('Location', /places/)
            .expect(204);

    });

    it('PATCH /api/places/:id should respond a http 400 KO', () => {

        var newPlace = {
            name: '',
            author: 'Pat',
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/2')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('PATCH /api/places/:id should respond a http 400 KO', () => {

        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Londre &',
            author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: ''
            }
        };
        return request(app)
            .patch('/api/places/2')
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(400);

    });

    it('PATCH /api/places/:id should respond a http 404 KO', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/99')
            .send(newPlace)
            .expect(404)
            .then(response => {
                expect(response.body.key).toBe("entity.not.found");
            });
    });  
});