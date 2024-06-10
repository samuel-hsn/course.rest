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

  it("GET /api/places/404 should respond a http 404", () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
      .get("/api/places/404")
      .expect("Content-Type", /json/)
      .expect(404)
      .expect(response => {
        expect(response.body.key).toBe("entity.not.found");
      });
  });

  it('GET /api/places should respond a http 200 OK with right amount of places', () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
        .get('/api/places')
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

    it('DELETE /api/places/1 should respond a http 200 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/1')
            .expect('Location', /places/)
            .expect(200);
    });
    it('DELETE /api/places/0 should respond a http 404 KO', () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .delete('/api/places/0')
            .expect('Content-Type', /json/)
            .expect(404)
            .then(response => {
                expect(response.body.error).toBe("Place not found");
            });;
    });

    it('PUT /api/places/1 should respond a http 204 OK - No Content', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Verdun',
            author: 'Jean Frere',
            review: 5,
            image: {
                url: 'https://imgs.search.brave.com/DqGcsUJW2p3ZB8YQt-21eKOcGK_MFWx14KAaZly_KBU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/MzI4ODIwL3Bob3Rv/L3ZlcmR1bi1taWxp/dGFyeS1tdXNsaW0t/Y2VtZXRlcnktZnJh/bmNlLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1UZGRVV09u/WWFlWjFRdldlVUxz/XzNpRHkzQTBBRnNO/WVVVV1kyUlRMOVFN/PQ',
                title: 'Verdun cimetierre'
            }
        };
        return request(app)
            .put('/api/places/1')
            .send(newPlace)
            .expect('Location', '/api/places/1')
            .expect(204);
    });

    it('PUT /api/places/20 should respond a http 201 Created', () => {
        const app = new App(new Place(new PlaceData())).app;
        var newPlace = {
            name: 'Verdun',
            author: 'Jean Frere',
            review: 5,
            image: {
                url: 'https://imgs.search.brave.com/DqGcsUJW2p3ZB8YQt-21eKOcGK_MFWx14KAaZly_KBU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/MzI4ODIwL3Bob3Rv/L3ZlcmR1bi1taWxp/dGFyeS1tdXNsaW0t/Y2VtZXRlcnktZnJh/bmNlLmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1UZGRVV09u/WWFlWjFRdldlVUxz/XzNpRHkzQTBBRnNO/WVVVV1kyUlRMOVFN/PQ',
                title: 'Verdun cimetierre'
            }
        };
        return request(app)
            .put('/api/places/20')
            .send(newPlace)
            .expect('Location', '/api/places/20')
            .expect(201);
    });
    
});
