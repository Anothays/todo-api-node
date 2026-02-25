import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Todos API", version: "1.0.0" },
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "My todo" },
            description: { type: "string", nullable: true },
            status: { type: "string", example: "pending" },
          },
        },
        TodoInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "My todo" },
            description: { type: "string", nullable: true },
            status: { type: "string", default: "pending", example: "pending" },
          },
        },
        Error: {
          type: "object",
          properties: {
            detail: { type: "string", example: "Todo not found" },
          },
        },
      },
    },
  },
  apis: ["./routes/todo.js", "./app.js"],
};

export const spec = swaggerJsdoc(options);
