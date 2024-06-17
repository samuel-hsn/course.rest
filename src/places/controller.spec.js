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
  it("GET /api/places should respond a http 200 OK", () => {
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

  //TEST POUR SUPPRIMER UNE PLACE 
  it('DELETE /api/places/1 should respond a http 204 OK', () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .delete('/api/places/1')
      .expect(204);
  });

  it('DELETE /api/places/1 should respond a http 404 KO', () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .delete('/api/places/1gfaz')
      .expect(404);
  });

  // TEST POUR MODIFIER UNE PLACE ENTIEREMENT
  // it('PUT /api/places should respond a http 201 OK with no image', () => {
  //     var newPlace = {
  //         name: 'Londre',
  //         author: 'Patrick',
  //         review: 2
  //     };
  //     const app = new App(new Place(new PlaceData())).app;
  //     return request(app)
  //         .post('/api/places')
  //         .send(newPlace)
  //         .expect('Location', /places/)
  //         .expect(201);
  // });

  // it('PUT /api/places should respond a http 201 OK with an image', () => {

  //     var newPlace = {
  //         name: 'Londre',
  //         author: 'Patrick',
  //         review: 2,
  //         image: {
  //             url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
  //             title: 'bworld place'
  //         }
  //     };
  //     const app = new App(new Place(new PlaceData())).app;
  //     return request(app)
  //         .post('/api/places')
  //         .send(newPlace)
  //         .expect('Location', /places/)
  //         .expect(201);

  // });

  // it('PUT /api/places should respond a http 400 KO', () => {

  //     var newPlace = {
  //         name: '',
  //         author: 'Pat',
  //         review: 2
  //     };
  //     const app = new App(new Place(new PlaceData())).app;
  //     return request(app)
  //         .post('/api/places')
  //         .send(newPlace)
  //         .expect('Content-Type', /json/)
  //         .expect(400);

  // });

  // it('PUT /api/places should respond a http 400 KO', () => {

  //     const app = new App(new Place(new PlaceData())).app;
  //     var newPlace = {
  //         name: 'Londre &',
  //         author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
  //         review: 2,
  //         image: {
  //             url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
  //             title: ''
  //         }
  //     };
  //     return request(app)
  //         .post('/api/places')
  //         .send(newPlace)
  //         .expect('Content-Type', /json/)
  //         .expect(400);

  // });

  //TEST POUR MODIFIER UNE PLACE PARTIELLEMENT avec PUT

  // Cas 1 : Place trouvée et données valides
  it('PATCH /api/places/:id should replace a place with valid data', () => {
    let id = 3;
    const app = new App(new Place(new PlaceData())).app;
    const updatedPlace = {
      name: 'Paris Updated',
      author: 'Jean Updated',
      review: 8
    };
    return request(app)
      .patch(`/api/places/${id}`)
      .send(updatedPlace)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(response => {
        expect(response.body.id).toBe("3");
      });
  });

  // Cas 2 : Place trouvée et données non valides
  it('PATCH /api/places/:id should respond with 404 for invalid data', () => {
    let id = 3;
    const invalidPlace = {
      name: 'Pa', // Invalid name
      author: 'J', // Invalid author
      review: 20 // Invalid review
    };
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .patch(`/api/places/${id}`)
      .send(invalidPlace)
      .expect('Content-Type', /json/)
      .expect(400)
  });

  // Cas 3 : Place non trouvée
  it('PATCH /api/places/:id should respond with 404 for non-existent place', () => {
    const updatedPlace = {
      name: 'NonExistent Place',
      author: 'NonExistent Author',
      review: 5
    };
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .patch(`/api/places/999`)
      .send(updatedPlace)
      .expect('Content-Type', /json/)
      .expect(404)
      .expect(response => {
        expect(response.body.key).toBe("entity.not.found");
      });
  });

  // Cas 4 : Mise à jour partielle de la place
  it('PATCH /api/places/:id should update only specified properties', () => {
    let id = 3;
    const partialUpdate = {
      name: 'Paris Partially Updated'
    };
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .patch(`/api/places/${id}`)
      .send(partialUpdate)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(response => {
        expect(response.body.id).toBe("3");
      });
  });

});

