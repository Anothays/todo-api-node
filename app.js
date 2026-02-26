import dotenv from "dotenv";
import express from "express";
import * as Sentry from "@sentry/node";
import swaggerUi from "swagger-ui-express";
import { helmetMiddleware } from "./config/helmet.js";
import { spec } from "./config/swagger.js";
import todoRouter from "./routes/todo.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/todos", todoRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
app.use(helmetMiddleware);

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
  try {
    Sentry.logger.info("GET / root", { path: "/" });
    res.json({ message: "Welcome to the Enhanced Express Todo App!" });
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
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
  try {
    Sentry.logger.info("GET /health", { path: "/health" });
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

export default app;
