const request = require("supertest");
const App = require("../app");
const PlaceData = require("./data");
const Place = require("./controller");
const { response } = require("express");

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
  it('GET /api/places should respond a http 200 ok', () => {
    const app = new App(new Place(new PlaceData())).app;
    return request(app)
        .get("/api/places")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(response => {
            expect(response.body.length).toBe(3);
        });
  })

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

    it("DELETE /api/places/2 should respond a http 200 OK", () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .delete("/api/places/2")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(response => {
            expect(response.body.key).toBe("OK");
          });
    });

    it("DELETE /api/places/124 should respond a http 404 KO", () => {
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
          .delete("/api/places/124")
          .expect("Content-Type", /json/)
          .expect(404)
          .then(response => {
            expect(response.body.key).toBe("KO");
          });
    });

    it("PUT /api/places/2 should respond a http 200 OK", () => {
        const app = new App(new Place(new PlaceData())).app;

        var newPlace = {
          name: 'Londre',
          author: 'Jacques',
          review: 2,
        };

        return request(app)
          .put("/api/places/1")
          .send(newPlace)
          .expect("Content-Type", /json/)
          .expect(200)
          .then(response => {
            expect(response.body).toBe("1");
          });
    });

    it("PUT /api/places/2 should respond a http 400 invalid request", () => {
      const app = new App(new Place(new PlaceData())).app;

      var newPlace = {
        name: 'Londre',
        review: 2,
        image: null
      };

      return request(app)
        .put("/api/places/1")
        .send(newPlace)
        .expect("Content-Type", /json/)
        .expect(400)
        .then(response => {
          expect(response.body.key).toBe("invalid.request");
        });
    });

    it("PUT /api/places/124 should respond a http 404 entity not found", () => {
      const app = new App(new Place(new PlaceData())).app;

      var newPlace = {
        name: 'Londre',
        author: 'Jacques',
        review: 2
      };

      return request(app)
        .put("/api/places/124")
        .send(newPlace)
        .expect("Content-Type", /json/)
        .expect(404)
        .then(response => {
          expect(response.body.key).toBe("entity.not.found");
        });
    });

    it("PATCH /api/places/1 should respond a http 200 OK", () => {
      const app = new App(new Place(new PlaceData())).app;

      /* var data = {
        name : "New Name"
      }; */

      var data = [
        { op: "replace", path: "/name", value: "Saint-brieuc" },
        { op: "replace", path: "/author", value: "Robert" }
      ];

      return request(app)
        .patch("/api/places/1")
        .send(data)
        .expect("Content-Type", /json/)
        .expect(200)
        .then(response => {
          expect(response.body.id).toBe("1")
        });
    });

    it("PATCH /api/places/124 should respond a http 404 entity not found", () => {
      const app = new App(new Place(new PlaceData())).app;

      /* var data = {
        name : "New Name"
      }; */

      var data = [
        { op: "replace", path: "/name", value: "Saint-brieuc" },
        { op: "replace", path: "/author", value: "Robert" }
      ];

      return request(app)
        .patch("/api/places/144")
        .send(data)
        .expect("Content-Type", /json/)
        .expect(404)
        .then(response => {
          expect(response.body.key).toBe("entity.not.found")
        });
    });
});
