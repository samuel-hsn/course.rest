const request = require("supertest");
const App = require("../app");
const PlaceData = require("./data");
const Place = require("./controller");


describe("Places/controller", () => {
//   it("GET /api/places/2 should respond a http 200 OK", () => {
//     const app = new App(new Place(new PlaceData())).app;
//     return request(app)
//       .get("/api/places/2")
//       .expect("Content-Type", /json/)
//       .expect(200)
//       .then(response => {
//         expect(response.body.author).toBe("Louis");
//       });
//   });

//   it("GET /api/places/youhou should respond a http 404", () => {
//     const app = new App(new Place(new PlaceData())).app;
//     return request(app)
//       .get("/api/places/youhou")
//       .expect("Content-Type", /json/)
//       .expect(404)
//       .expect(response => {
//         expect(response.body.key).toBe("entity.not.found");
//       });
//   });

//   //Test qui vérifie le nombre de place remonté par l'api

//     it("GET /api/places should respond a http 200 OK", () => {
//         const app = new App(new Place(new PlaceData())).app;
//         return request(app)
//             .get("/api/places")
//             .expect("Content-Type", /json/)
//             .expect(200)
//             .then(response => {
//                 expect(response.body.length).toBe(3);
//             });
//     });

//     /** FIN GET **/

//     /************* POST REQUESTS ********************************************/ 
//     it('POST /api/places should respond a http 201 OK with no image', () => {
//         var newPlace = {
//             name: 'Londre',
//             author: 'Patrick',
//             review: 2
//         };
//         const app = new App(new Place(new PlaceData())).app;
//         return request(app)
//             .post('/api/places')
//             .send(newPlace)
//             .expect('Location', /places/)
//             .expect(201);
//     });

//     it('POST /api/places should respond a http 201 OK with an image', () => {

//         var newPlace = {
//             name: 'Londre',
//             author: 'Patrick',
//             review: 2,
//             image: {
//                 url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
//                 title: 'bworld place'
//             }
//         };
//         const app = new App(new Place(new PlaceData())).app;
//         return request(app)
//             .post('/api/places')
//             .send(newPlace)
//             .expect('Location', /places/)
//             .expect(201);

//     });

//     it('POST /api/places should respond a http 400 KO', () => {

//         var newPlace = {
//             name: '',
//             author: 'Pat',
//             review: 2
//         };
//         const app = new App(new Place(new PlaceData())).app;
//         return request(app)
//             .post('/api/places')
//             .send(newPlace)
//             .expect('Content-Type', /json/)
//             .expect(400);

//     });

//     it('POST /api/places should respond a http 400 KO', () => {

//         const app = new App(new Place(new PlaceData())).app;
//         var newPlace = {
//             name: 'Londre &',
//             author: 'Patrickmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm',
//             review: 2,
//             image: {
//                 url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
//                 title: ''
//             }
//         };
//         return request(app)
//             .post('/api/places')
//             .send(newPlace)
//             .expect('Content-Type', /json/)
//             .expect(400);

//     });

    /************************************* REQUEST DELETE **************************/
    // it('DELETE /api/places/2 should respond a http 200 OK', () => {

    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //     .delete("/api/places/2")
    //     .expect("Content-Type", /json/)
    //     .expect(200)

    // });
    // it('DELETE /api/places/999 should respond a http 400 KO', () => {

    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //     .delete("/api/places/999")
    //     .expect("Content-Type", /json/)
    //     .expect(404)
    // });


    /**************************PUT REQUESTS***********************************/
    // it('PUT /api/places/2 should respond a http 200 OK with no image', () => {
    //     var newPlace = {
    //         name: 'Londre',
    //         author: 'Patrick',
    //         review: 2
    //     };
    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //         .put('/api/places/2')
    //         .send(newPlace)
    //         .expect(200);
    // });

    // it('PUT /api/places/2 should respond a http 200 OK with an image', () => {

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
    //         .put('/api/places/2')
    //         .send(newPlace)
    //         .expect(200);

    // });

    // it('PUT /api/places/2 should respond a http 400 KO', () => {

    //     var newPlace = {
    //         name: '',
    //         author: 'Pat',
    //         review: 2
    //     };
    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //         .put('/api/places/2')
    //         .send(newPlace)
    //         .expect(400);

    // });

    // it('PUT /api/places/2 should respond a http 400 KO', () => {

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
    //         .put('/api/places/2')
    //         .send(newPlace)
    //         .expect(400);

    // });

    // it('PUT /api/places/999 should respond a http 404 KO with an image', () => {

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
    //         .put('/api/places/999')
    //         .send(newPlace)
    //         .expect(404);

    // });

    // it('PUT /api/places/999 should respond a http 404 KO', () => {

    //     var newPlace = {
    //         name: '',
    //         author: 'Pat',
    //         review: 2
    //     };
    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //         .put('/api/places/999')
    //         .send(newPlace)
    //         .expect(404);
    // });
    
    /**************************PATCH REQUESTS***********************************/
    it('PATCH /api/places/2 should respond a http 200 OK with no image', () => {
        var newPlace = {
            name: 'Londre',
            author: 'Patrick',
            review: 2
        };
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/2')
            .send(newPlace)
            .expect(200);
    });

    
    
    // it('PATCH /api/places/2 should respond a http 200 OK with an image', () => {
    //      var newPlace = {
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
    //         .patch('/api/places/2')
    //         .send(newPlace)
    //         .expect(200);
    // });
    
    // it('PATCH /api/places/2 should respond a http 400 KO', () => {
    //      var newPlace = {
    //         name: '',
    //         author: 'Pat',
    //         review: 2
    //     };
    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //         .patch('/api/places/2')
    //         .send(newPlace)
    //         .expect(400);
    // });
    
    // it('PATCH /api/places/2 should respond a http 400 KO', () => {
    //      const app = new App(new Place(new PlaceData())).app;
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
    //         .patch('/api/places/2')
    //         .send(newPlace)
    //         .expect(400);
    // });
    
    // it('PATCH /api/places/999 should respond a http 404 KO with an image', () => {
    //      var newPlace = {
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
    //         .patch('/api/places/999')
    //         .send(newPlace)
    //         .expect(404);
    // });
    
    // it('PATCH /api/places/999 should respond a http 404 KO', () => {
    //      var newPlace = {
    //         name: '',
    //         author: 'Pat',
    //         review: 2
    //     };
    //     const app = new App(new Place(new PlaceData())).app;
    //     return request(app)
    //         .patch('/api/places/999')
    //         .send(newPlace)
    //         .expect(404);
    // });

    /**************************PATCH REQUESTS + JSONPATCH***********************************/
    it('PATCH /api/places/2 should respond a http 200 OK with no image', () => {
        var patch = [
            { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ]
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/2')
            .set({"Content-Type":"application/json-patch+json"})
            .send(patch)
            .expect(200)
            .then(response => {
                expect(response.body.key).toBe("entity.updated.jsonpatch");
              });
    });

    it('PATCH /api/places/2 should respond a http 400 KO', () => {

        var patch = [
            { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ]
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/2')
            .send(patch)
            .expect(400);

    });

    it('PATCH /api/places/2 should respond a http 400 KO', () => {

        const app = new App(new Place(new PlaceData())).app;
        var patch = {
            name: 'Londre',
            author: 'Patrick',
            review: 2,
            image: {
                url: 'https://www.bworld.fr/api/file/get/c27e39ee-7ba9-46f8-aa7c-9e334c72a96c/d9d0634b-b1a0-42bd-843d-d3bc3cf7d842/ImageThumb/bworld-2016-v3.png',
                title: 'bworld place'
            }
        };
        return request(app)
            .patch('/api/places/2')
            .set({"Content-Type":"application/json-patch+json"})
            .send(patch)
            .expect(400);
            
    });

    it('PATCH /api/places/999 should respond a http 404 KO with an image', () => {

        var patch = {
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
            .patch('/api/places/999')
            .set({"Content-Type":"application/json-patch+json"})
            .send(patch)
            .expect(404);
    });

    it('PATCH /api/places/999 should respond a http 404 KO', () => {

        var patch = [
            { "op": "replace", "path": "/name", "value": "Saint-brieuc" },
            { "op": "replace", "path": "/author", "value": "Robert" }
        ]
        const app = new App(new Place(new PlaceData())).app;
        return request(app)
            .patch('/api/places/999')
            .set({"Content-Type":"application/json-patch+json"})
            .send(patch)
            .expect(404);
    });

    
});
