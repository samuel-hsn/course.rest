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
        const response = request(app)
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

        const response = request(app)
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

        const response = request(app)
            .put(`/api/places/66`)
            .send(newPlace)
            .expect('Content-Type', /json/)
            .expect(404);

    });

    //Partie 12
    // Cas 1 : Place trouvée et données valides
    it('PUT /api/places/:id should replace a place with valid data', () => {
        const app = new App(new Place(new PlaceData())).app;
        const updatedPlace = {
            id: "1",
            name: 'Paris Updated',
            author: 'Jean Updated',
            review: 8
        };
        return request(app)
            .put(`/api/places/1`)
            .send(updatedPlace)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(response => {
                expect(response.body.id).toBe("1");
            });
    });

    // Cas 2 : Place trouvée et données non valides
    it('PUT /api/places/:id should respond with 400 for invalid data', () => {
        const invalidPlace = {
            id: "1",
            name: 'Pa', // Invalid name
            author: 'J', // Invalid author
            review: 20 // Invalid review
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .put(`/api/places/1`)
            .send(invalidPlace)
            .expect('Content-Type', /json/)
            .expect(400)
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
    });

    // Cas 4 : Mise à jour partielle de la place
    it('PUT /api/places/:id should update only specified properties', () => {
        const partialUpdate = {
            id: "1",
            name: 'Paris Partially Updated'
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .put(`/api/places/1`)
            .send(partialUpdate)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(response => {
                expect(response.body.id).toBe("1");
            });
    });

    //Partie 13 : Utilisation de Patch 
    it('Patch /api/places/2 should update only specified properties', async () => {
        const app = new App(new Place(new PlaceData())).app;

        const patchData = [
            { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ];

        await request(app)
            .patch('/api/places/1')
            .set('Content-Type', 'application/json-patch+json')
            .send(patchData)
            .expect('Content-Type', /json/)
            .expect(200)
    });

    //Partie 15
    it('should respond with places filtered by name query', async () => {
        const app = new App(new Place(new PlaceData())).app;
        const data = new PlaceData();

        // Créer des places initiales pour le test
        const places = [
            { id: '1', name: 'Paris' },
            { id: '2', name: 'London' },
            { id: '3', name: 'New York' },
            { id: '4', name: 'Tokyo' },
            { id: '5', name: 'Sydney' },
        ];
        await Promise.all(places.map(place => data.savePlaceAsync(place)));

        // Effectuer une requête GET avec query string pour filtrer par nom
        const response = await request(app)
            .get('/api/places')
            .query({ name: 'Yo' }) // Exemple de recherche par nom
            .expect('Content-Type', /json/)
            .expect(200);
    });

    it('should respond with all places if no name query is provided', async () => {
        const app = new App(new Place(new PlaceData())).app;
        const data = new PlaceData();

        // Créer des places initiales pour le test
        const places = [
            { id: '1', name: 'Paris' },
            { id: '2', name: 'London' },
            { id: '3', name: 'New York' },
            { id: '4', name: 'Tokyo' },
            { id: '5', name: 'Sydney' },
        ];
        await Promise.all(places.map(place => data.savePlaceAsync(place)));

        // Effectuer une requête GET sans query string pour récupérer toutes les places
        const response = await request(app)
            .get('/api/places')
            .expect('Content-Type', /json/)
            .expect(200);
    });


});
