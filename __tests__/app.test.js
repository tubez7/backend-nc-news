const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index")

afterAll(() => db.end());
beforeEach(() => seed(testData));


describe('Generic invalid endpoint error', () => {
    test('Entering invalid endpoint should return 404 path not found', () => {
        return request(app).get("/Not-An-API").expect(404).then((res) => {
            console.log(res, "error res")
            expect(res.body.msg).toBe("path not found");
        })        
    });    
});


describe('GET request on /api/topics', () => {
    test('should respond with status 200 and an array of all topic objects, each of which should have slug and description properties', () => {
        return request(app).get(`/api/topics`).expect(200).then((res) => {
            expect(res.body.topics).toBeInstanceOf(Array);
            expect(res.body.topics).toHaveLength(3);
            console.log(res.body, "res body");//obj with key of topics
            console.log(res.body.topics);//array of objects
            res.body.topics.forEach((topic) => {
                expect(topic).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String)
                }))
            })
        })        
    });    
});





            