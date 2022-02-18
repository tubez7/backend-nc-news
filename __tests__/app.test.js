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
        //res.body = obj with key of topics
        //res.body.topics = array of objects
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

describe("GET request on /api/articles", () => {
  test("should respond with status 200 and an array of all article objects on a key of articles sorted in date order ascending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSortedBy("created_at", { coerce: true });
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
});

describe("GET request on /api/articles/:article_id", () => {
  test("should respond with status 200 and a single article object on a key of article", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });
});

describe("REFACTORED GET request on /api/articles/:article_id", () => {
  test("should respond with status 200 and a single article object on a key of article including a comment_count property", () => {
    const articleId = 7;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            comment_count: 0,
          })
        );
      });
  });
});

//--------ERRORS FOR GET REQUESTS ON ARTICLE ID

describe("ERROR handling GET request on /api/articles/:article_id", () => {
  test("respond with status 400 - bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("respond with status 404 - article not found for valid but non-existent article_id", () => {
    const articleId = 9999;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`article ${articleId} not found`);
      });
  });
});

//----------PATCH REQUESTS ON ARTICLES

describe("PATCH request on /api/articles/:article_id", () => {
  test("status: 201 - request body object should update the vote property of the article and respond with an article object on key of article", () => {
    const articleId = 1;
    const vote = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toBeInstanceOf(Object);
        expect(res.body.article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 101,
          })
        );
      });
  });
  test("should respond the same with a minus vote patch request", () => {
    const articleId = 1;
    const vote = { inc_votes: -100 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toBeInstanceOf(Object);
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
});

//---------PATCH REQUEST ERRORS ON ARTICLE_ID

describe("ERROR handling patch request on /api/articles/:article_id", () => {
  test("should respond with status 400 - bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    const vote = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("should should respond with status 400 - bad request when vote object property is not a number", () => {
    const articleId = 1;
    const vote = { inc_votes: "NOT_A_NUMBER" };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("should should respond with status 400 - bad request when vote object key is not valid", () => {
    const articleId = 1;
    const vote = { NOT_VALID: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("should should respond with status 400 - bad request when vote object is not provided", () => {
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send()
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("respond with status 404 - article not found for valid but non-existent article_id", () => {
    const articleId = 9999;
    const vote = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`article ${articleId} not found`);
      });
  });
});

//-----------GET REQUEST FOR USERS--------

describe("GET request on /api/users", () => {
  test("return an array of all user objects.", () => {
    return request(app)
      .get(`/api/users`)
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

//---------------POST REQUEST ON ARTICLE_ID COMMENTS

// describe("POST /api/articles/:article_id/comments", () => {
//   test("should add comment to the db. Responds with status: 201 and the posted comment on a key of comment", () => {
//     const articleId = 1;
//     const comment = { username: "test_user", body: "test_body" };
//     return request(app)
//       .post(`/api/articles/${articleId}/comments`)
//       .send(comment)
//       .expect(201)
//       .then(({ body }) => {
//         expect(body.comment).toBeInstanceOf(Object);
//         expect(body.comment).toEqual(
//           expect.objectContaining({
//             comment: "test_body",
//           })
//         );
//       });
//   });
// });


