const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

//----------GENERIC SERVER ERROR

describe("Generic invalid endpoint error", () => {
  test("Entering invalid endpoint should return 404 path not found", () => {
    return request(app)
      .get("/Not-An-API")
      .expect(404)
      .then((res) => {
        console.log(res, "error res");
        expect(res.body.msg).toBe("path not found");
      });
  });
});

//-------GET REQUESTS ON TOPICS

describe("GET request on /api/topics", () => {
  test("should respond with status 200 and an array of all topic objects, each of which should have slug and description properties", () => {
    return request(app)
      .get(`/api/topics`)
      .expect(200)
      .then((res) => {
        expect(res.body.topics).toBeInstanceOf(Array);
        expect(res.body.topics).toHaveLength(3);
        console.log(res.body, "res body"); //obj with key of topics
        console.log(res.body.topics); //array of objects
        res.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});

//---------GET REQUESTS ON ARTICLES

describe("GET request on /api/articles/:article_id", () => {
  test("should respond with status 200 and a single article object on a key of article", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
});

describe("ERROR handling GET request on /api/articles/:article_id", () => {
  test("respond with status 400 - bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(400)
      .then((res) => {
        console.log(res, "400 INSIDE TEST SUITE");
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("respond with status 404 - article not found for valid but non-existent article_id", () => {
    const articleId = 9999;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then(({ body }) => {
        console.log(body, "404 INSIDE TEST SUITE");
        expect(body.msg).toBe(`article ${articleId} not found`);
      });
  });
});

//----------PATCH REQUESTS ON ARTICLES

describe.only("PATCH request on /api/articles/:article_id", () => {
  test("status: 201 - request body object should update the vote property of the article and respond with an article object on key of article", () => {
    const articleId = 1;
    const vote = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(201)
      .then((res) => {
        console.log(res.body.article, "response body in test suite");
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
        });
      });
  });
  test("should respond the same with a minus vote patch request", () => {
    const articleId = 1;
    const vote = { inc_votes: -100 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
        });
      });
  });
});
