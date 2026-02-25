import dotenv from "dotenv";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import todoRouter from "./routes/todo.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use("/todos", todoRouter);

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

const spec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Message de bienvenue
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Bienvenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Welcome to the Enhanced Express Todo App!"
 */
app.get("/", (_req, res) => {
  console.log("someone hit the root endpoint");
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: État de l'API (health check)
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: API opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
