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

    //// TODO Ajouter ici le test qui vérifie le nombre de place remonté par l'api
    it("GET /api/places should respond a http 200 OK", () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .get("/api/places")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(3);
            });
    });
    ////

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

    //// test de suppression
    it('DELETE /api/places/2 should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/2')
            .expect(204);
    });

    it('DELETE /api/places/4 should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/4')
            .expect(404);
    });

    //// test de remplacement
    it('PUT /api/places/1 should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Londre',
            author: 'Tristan',
            review: 2
        };
        return request(app)
            .put('/api/places/1')
            .send(newPlace)
            .expect(204);
    }
    );

    it('PUT /api/places/5 should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Londre',
            author: 'Tristan',
            review: 2
        };
        return request(app)
            .put('/api/places/5')
            .send(newPlace)
            .expect(404);
    }
    );

    //// PATCH
    it('PATCH /api/places/1 should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            author: 'TristanVdeux',
        };
        return request(app)
            .patch('/api/places/1')
            .send(newPlace)
            .expect(204);
    }
    );

    //// 
    it('PATCH /api/places/5 should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            author: 'TristanVdeux',
        };
        return request(app)
            .patch('/api/places/5')
            .send(newPlace)
            .expect(404);
    }
    );

    //// 
    it('PATCH /api/places/1 should respond a http 400 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            author: 'TristanV2',
        };
        return request(app)
            .patch('/api/places/1')
            .send(newPlace)
            .expect(400);
    }
    );

    //// json patch jsonschema
    it('PATCH /places/1 should respond a http 204 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = [
            { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ];

        return request(app)
            .patch('/api/places/1')
            .set('Content-Type', 'application/json-patch+json')
            .send(newPlace)
            .expect(204);
    }
    );

    it('PATCH /places/5 should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = [
            { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ];

        return request(app)
            .patch('/api/places/5')
            .set('Content-Type', 'application/json-patch+json')
            .send(newPlace)
            .expect(404);
    }
    );

    it('PATCH /places/1 should respond a http 400 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = [
            { "op": "replace666", "path": "/name", "value": "" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ];

        return request(app)
            .patch('/api/places/1')
            .set('Content-Type', 'application/json-patch+json')
            .send(newPlace)
            .expect(400);
    }
    );

});