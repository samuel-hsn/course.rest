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

  it("GET /api/places should respond a http 200 OK", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places")
      .expect("Content-Type", /json/)
      .expect(200)
      .then(response => {
        expect(response.body.data.length).toBe(3);
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

    it('DELETE /api/places/1 should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/1')
            .expect(204);
    });

    it('DELETE /api/places/1 should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/1')
            .expect(204);
    });

    it('DELETE /api/places/youhou should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/youhou')
            .expect(204);
    });

    it('PUT /api/places/2 should respond a http 202 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            name: 'Updated Place',
            author: 'John',
            review: 4
        };
        return request(app)
            .put('/api/places/2')
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(202)
            .then(response => {
                expect(response.body.name).toBe('Updated Place');
                expect(response.body.author).toBe('John');
                expect(response.body.review).toBe(4);
            });
    });

    it('PUT /api/places/1 should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            name: 'Updated Place',
            author: 'John',
            review: 4
        };
        return request(app)
            .put('/api/places/1')
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.key).toBe('not.found');
            });
    });

    it('PUT /api/places/youhou should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            name: 'Updated Place',
            author: 'John',
            review: 4
        };
        return request(app)
            .put('/api/places/youhou')
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.key).toBe('not.found');
            });
    });

    it('PATCH /api/places/2 should respond a http 202 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            name: 'Updated V2 Place',
        };
        return request(app)
            .patch('/api/places/2')
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(202)
            .then(response => {
                expect(response.body.name).toBe('Updated V2 Place');
            });
    });

    it('PATCH /api/places/1 should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            name: 'Updated Place',
        };
        return request(app)
            .patch('/api/places/1')
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.key).toBe('not.found');
            });
    });

    it('PATCH /api/places/youhou should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            name: 'Updated Place',
        };
        return request(app)
            .patch('/api/places/youhou')
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.key).toBe('not.found');
            });
    });

    /* it('PATCH /api/places/2 using JSON Patch should respond a http 202 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        const jsonPatch = [
            { op: 'replace', path: '/name', value: 'Updated V3 Place' },
            { op: 'add', path: '/author', value: 'John' },
            { op: 'replace', path: '/review', value: 1}
        ];
        return request(app)
            .patch('/api/places/2')
            .set('Content-Type', 'application/json-patch+json')
            .send(jsonPatch)
            .expect('Content-Type', /json/)
            .expect(202)
            .then(response => {
                expect(response.body.name).toBe('Updated V3 Place');
                expect(response.body.author).toBe('John');
                expect(response.body.review).toBe(1);
            });
    }); */

    it('PATCH /api/places/1 using JSON Patch should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        const jsonPatch = [
            { op: 'replace', path: '/name', value: 'Updated Place' }
        ];
        return request(app)
            .patch('/api/places/1')
            .set('Content-Type', 'application/json-patch+json')
            .send(jsonPatch)
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.key).toBe('not.found');
            });
    });

    it('PATCH /api/places/youhou using JSON Patch should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        const jsonPatch = [
            { op: 'replace', path: '/name', value: 'Updated Place' }
        ];
        return request(app)
            .patch('/api/places/youhou')
            .set('Content-Type', 'application/json-patch+json')
            .send(jsonPatch)
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.key).toBe('not.found');
            });
    });

    it('GET /api/places?name=lon should respond a http 200 OK with filtered places', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .get('/api/places?name=lon')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                const filteredPlaces = response.body.data;
                expect(filteredPlaces.length).toBe(2);
                expect(filteredPlaces[0].name.toLowerCase()).toContain('lon');
                expect(filteredPlaces[1].name.toLowerCase()).toContain('lon');
            });
    });

    it('GET /api/places?name=fra should respond a http 200 OK with filtered places', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .get('/api/places?name=fra')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                const filteredPlaces = response.body.data;
                expect(filteredPlaces.length).toBe(1);
                expect(filteredPlaces[0].name.toLowerCase()).toContain('fra');
            });
    });

    it('GET /api/places?name=xyz should respond a http 200 OK with empty array', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .get('/api/places?name=xyz')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
                const filteredPlaces = response.body.data;
                expect(filteredPlaces.length).toBe(0);
            });
    });
});
