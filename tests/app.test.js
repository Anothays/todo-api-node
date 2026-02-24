const request = require("supertest");
const app = require("../app");

describe("Testing endpoints", () => {
  it(`GET on "/"" responds with a welcome message`, () => {
    return request(app)
      .get("/")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ message: "Welcome to the Enhanced Express Todo App!" });
      });
  });

  it(`GET on "/unknown" responds with a 404 for unknown routes`, () => {
    return request(app).get("/unknown").expect(404);
  });

  it(`GET on "/debug" responds with debug information`, () => {
    console.log("process.env.NODE_ENV -> ", process.env.NODE_ENV);
    return request(app)
      .get("/debug")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("secret");
        expect(response.body).toHaveProperty("api_key");
        expect(response.body).toHaveProperty("env");
      });
  });
});

describe("Testing /todos endpoints", () => {
  it(`GET on "/todos" responds with an empty array when no todos exist`, () => {
    return request(app)
      .get("/todos")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual([]);
      });
  });

  it(`POST on "/todos" creates a new todo and responds with the created todo`, () => {
    const newTodo = { title: "Test Todo", status: "pending", description: "This is a test todo" };
    return request(app)
      .post("/todos")
      .send(newTodo)
      .expect(201)
      .then((response) => {
        expect(response.body).toMatchObject({
          title: newTodo.title,
          status: newTodo.status,
          description: newTodo.description,
        });
        expect(response.body).toHaveProperty("id", expect.any(Number));
      });
  });

  it(`GET on "/todos" responds with an array of todos after creating a todo`, () => {
    const newTodo = { title: "Another Test Todo", status: "pending", description: "This is another test todo" };
    return request(app)
      .post("/todos")
      .send(newTodo)
      .expect(201)
      .then(() => {
        return request(app)
          .get("/todos")
          .expect(200)
          .then((response) => {
            expect(response.body.length).toBeGreaterThanOrEqual(1);
            expect(response.body[0]).toHaveProperty("id", expect.any(Number));
            expect(response.body[0]).toHaveProperty("title");
            expect(response.body[0]).toHaveProperty("status");
            expect(response.body[0]).toHaveProperty("description");
          });
      });
  });

  it(`GET on "/todos/:id" responds with a todo by id`, () => {
    return request(app)
      .get("/todos/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("id", 1);
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("status");
        expect(response.body).toHaveProperty("description");
      });
  });

  it(`GET on "/todo/search/all" with queryParam`, () => {
    return request(app)
      .get("/todos/search/all")
      .query({ q: "Test" })
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty("id", expect.any(Number));
        expect(response.body[0]).toHaveProperty("title");
        expect(response.body[0]).toHaveProperty("status");
        expect(response.body[0]).toHaveProperty("description");
      });
  });

  it(`PUT on "/todos/:id" updates a todo and responds with the updated todo`, () => {
    const updatedTodo = {
      title: "helloWorld",
      status: "success",
      description: "updated first todo !",
    };
    return request(app)
      .put("/todos/1")
      .send(updatedTodo)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject(updatedTodo);
        expect(response.body).toHaveProperty("id", 1);
      });
  });

  it(`DELETE on "/todos/:id" deletes a todo and responds with a success message`, () => {
    return request(app)
      .delete("/todos/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ detail: "Todo deleted" });
      });
  });

  it(`GET on "/todos/:id" responds with 404 after deleting a todo`, () => {
    return request(app).get("/todos/1").expect(404);
  });
});
