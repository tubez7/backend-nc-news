const request = require("supertest");
const db = require("../db/connection.js");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

//-------GENERIC SERVER ENDPOINT ERROR

describe("Generic invalid endpoint error", () => {
  test("Entering invalid endpoint should return 404 path not found", () => {
    return request(app)
      .get("/Not-An-API")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

//-------GET request on /api

describe("GET request on /api", () => {
  test("should respond with status 200 and a JSON describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.api).toBeInstanceOf(Object);
        expect(body.api).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
            "GET /api/articles/:article_id": expect.any(Object),
            "GET /api/users": expect.any(Object),
            "GET /api/articles/:article_id/comments": expect.any(Object),
            "PATCH /api/articles/:article_id": expect.any(Object),
            "POST /api/articles/:article_id/comments": expect.any(Object),
            "DELETE /api/comments/:comment_id": expect.any(Object),
          })
        );
      });
  });
});

//-------GET request on /api/topics

describe("GET request on /api/topics", () => {
  test("should respond with status 200 and an array of all topic objects, each of which should have slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
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

//-------GET request on /api/articles

describe("GET request on /api/articles", () => {
  test("should respond with status 200 and an array of all article objects on a key of articles sorted in date order descending", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
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

describe("REFACTORED GET request on /api/articles", () => {
  test("should respond with status 200 and an array of all article objects, including a comment_count property, on a key of articles", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});

//-------QUERIES for GET request on /api/articles

describe("QUERIES for GET request on /api/articles", () => {
  test("should accept a sort by query which sorts the articles by any valid column - defaults to date", () => {
    const sortBy = { sort_by: "title" };
    return request(app)
      .get(`/api/articles`)
      .query(sortBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("sort test with different sort field", () => {
    const sortBy = { sort_by: "comment_count" };
    return request(app)
      .get(`/api/articles`)
      .query(sortBy)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("will sort in ascending order when provided in request query", () => {
    const order = { order: "asc" };
    return request(app)
      .get(`/api/articles`)
      .query(order)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at");
      });
  });
  test("will sort in ascending order when provided in request query with a sort by query", () => {
    const query = { sort_by: "comment_count", order: "asc" };
    return request(app)
      .get(`/api/articles`)
      .query(query)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("comment_count");
      });
  });
  test("will filter the articles by topic when present in the request query", () => {
    const topic = { topic: "mitch" };
    return request(app)
      .get(`/api/articles`)
      .query(topic)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        expect(body.articles).toHaveLength(11);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("will return the correct query result with multiple query fields", () => {
    const query = { topic: "mitch", sort_by: "author", order: "asc" };
    return request(app)
      .get(`/api/articles`)
      .query(query)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author");
        expect(body.articles).toHaveLength(11);
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: "mitch",
            })
          );
        });
      });
  });
  test("will return the correct query result with multiple query fields", () => {
    const query = { topic: "paper", sort_by: "author", order: "asc" };
    return request(app)
      .get(`/api/articles`)
      .query(query)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(0);
      });
  });
});

//-------ERROR handling GET request on /api/articles

describe("ERROR handling GET request on /api/articles", () => {
  test("should respond with status 400 - invalid sort query when request sort by property is invalid", () => {
    const query = { sort_by: "INVALID" };
    return request(app)
      .get(`/api/articles`)
      .query(query)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request - INVALID SORT QUERY");
      });
  });
  test("should respond with status 400 - invalid order query when request order property is invalid", () => {
    const query = { order: "INVALID" };
    return request(app)
      .get(`/api/articles`)
      .query(query)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request - INVALID ORDER QUERY");
      });
  });
});

//-------GET request on /api/articles/:article_id

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

//-------ERROR handling GET request on /api/articles/:article_id

describe("ERROR handling GET request on /api/articles/:article_id", () => {
  test("respond with status 400 - bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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

//-------PATCH request on /api/articles/:article_id

describe("PATCH request on /api/articles/:article_id", () => {
  test("status: 201 - request body object should update the vote property of the article and respond with an article object on key of article", () => {
    const articleId = 1;
    const vote = { inc_votes: 1 };
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

//-------ERROR handling PATCH request on /api/articles/:article_id

describe("ERROR handling PATCH request on /api/articles/:article_id", () => {
  test("should respond with status 400 - bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    const vote = { inc_votes: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should should respond with status 400 - bad request when vote object property is not a number", () => {
    const articleId = 1;
    const vote = { inc_votes: "NOT_A_NUMBER" };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should should respond with status 400 - bad request when vote object key is not valid", () => {
    const articleId = 1;
    const vote = { NOT_VALID: 1 };
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(vote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should should respond with status 400 - bad request when vote object is not provided", () => {
    const articleId = 1;
    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
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

//-------GET request on /api/users

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
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

//-------POST request on /api/articles/:article_id/comments

describe("POST request on /api/articles/:article_id/comments", () => {
  test("should add comment to the db. Responds with status: 201 and the posted comment on a key of comment", () => {
    const articleId = 1;
    const comment = { username: "rogersop", body: "test_body" };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toBeInstanceOf(Object);
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            body: "test_body",
            article_id: 1,
            author: "rogersop",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
});

//-------ERROR handling POST request on /api/articles/:article_id/comments

describe("ERROR handling POST request on /api/articles/:article_id/comments", () => {
  test("should respond with 400 bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    const comment = { username: "rogersop", body: "test_body" };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 400 bad request when request body is incorrectly formatted ", () => {
    const articleId = 1;
    const comment = { username: "rogersop", incorrect_key: "test_body" };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 400 bad request - INVALID USERNAME when username does not exist on database", () => {
    const articleId = 1;
    const comment = { username: "INVALID_ID", body: "test_body" };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request - INVALID USERNAME");
      });
  });
  test("should respond with status 404 - article not found for valid but non-existent article_id", () => {
    const articleId = 9999;
    const comment = { username: "rogersop", body: "test_body" };
    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`article ${articleId} not found`);
      });
  });
});

//-------GET request on /api/articles/:article_id/comments

describe("GET request on /api/articles/:article_id/comments", () => {
  test("should respond with status 200 and an array of all comments for the requested article", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("should respond with status 200 and an empty array when article has no comments", () => {
    const articleId = 2;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(0);
        expect(body.comments).toEqual([]);
      });
  });
});

//-------ERROR handling GET request on /api/articles/:article_id/comments

describe("ERROR handling GET request on /api/articles/:article_id/comments", () => {
  test("should respond with status 400 - bad request when article_id is not a number", () => {
    const articleId = "NOT_A_NUMBER";
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with status 404 - not found when article_id is a number that does not exist on database", () => {
    const articleId = 9999;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`article ${articleId} not found`);
      });
  });
});

//-------DELETE request on /api/comments/:comment_id

describe("DELETE request on /api/comments/:comment_id", () => {
  test("should respond with status 204 - no content and successfully deletes correct comment", () => {
    const commentId = 1;
    return request(app).delete(`/api/comments/${commentId}`).expect(204);
  });
});

//-------ERROR handling DELETE request on /api/comments/:comment_id

describe("ERROR handling DELETE request on /api/comments/:comment_id", () => {
  test("should respond with status 404 - when article id is valid but doesn't exist on database", () => {
    const commentId = 9999;
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`comment ${commentId} not found`);
      });
  });
  test("should respond with status 400 - bad request when article id is invalid", () => {
    const commentId = "NOT_A_NUMBER";
    return request(app)
      .delete(`/api/comments/${commentId}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`bad request`);
      });
  });
});

//-------GET request on /api/users/:username

describe("GET request on /api/users/:username", () => {
  test("should respond with status 200 and a single user object on a key of user", () => {
    const username = "lurker";
    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toBeInstanceOf(Object);
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          })
        );
      });
  });
});

//-------ERROR handling GET request on /api/users/:username

describe("ERROR handling GET request on /api/users/:username", () => {
  test("should respond with status 404 - user not found for non-existent username", () => {
    const username = 9999;
    return request(app)
      .get(`/api/users/${username}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`username ${username} does not exist`);
      });
  });
});
    
