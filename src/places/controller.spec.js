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

    it("GET /api/places should respond a http 200 OK  whith the right number of places", () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .get("/api/places")
            .expect("Content-Type", /json/)
            .expect(200)
            .then(response => {
                expect(response.body.length).toBe(3);
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

    //Tester réussite suppression place
    it('DELETE /api/places/2 should respond a http 200 OK', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/2')
            .expect(200)
            .then(response => {
                expect(response.body.response).toBe('Object succesfully deleted');
            });
    });

    //Tester échec suppression place
    it('DELETE /api/places/10 should respond a http 404', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/10')
            .expect('Content-Type', /json/)
            .expect(404)
            .expect(response => {
                expect(response.body.error).toBe('Place not found');
            });
    });

    //Teste remplacer place succes
    it('PUT /api/places should respond a http 201 OK with an image', () => {
        const app = new App(new Place(new PlaceData())).app;
        // Définir les nouvelles valeurs pour la place
        const newPlace = {
            name: 'Paris',
            author: 'Pierre',
            review: 5,
            image: {
                url: 'https://example.com/image.png',
                title: 'A nice place'
            }
        };

        // Envoyer la requête de remplacement de la place
        const response =  request(app)
            .put(`/api/places/1`)
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(200);
    });

    //Teste remplacer mais pas le bon format
    it('PUT /api/places should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;

        const newPlace = {
            name: 'Paris',
            author: 'Pièrre',
            review: 5,
            image: {
                url: 'https://example.com/image.png',
                title: 'A nice place'
            }
        };

        const response =  request(app)
        .put(`/api/places/1`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
        
    });

    it('PUT /api/places should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;

        const newPlace = {
            name: 'Paris',
            author: 'Pierre',
            review: 5,
            image: {
                url: 'https://example.com/image.png',
                title: 'A nice place'
            }
        };

        const response =  request(app)
        .put(`/api/places/66`)
        .send(newPlace)
        .expect('Content-Type', /json/)
        .expect(404);
        
    });

});
