import * as Sentry from "@sentry/node";
import { Router } from "express";
import { getDb, saveDb } from "../database/database.js";
import { toArray, toObj } from "../helpers/utils.js";
import { paramsId, queryList, querySearch, todoInput, todoInputPartial, validate } from "./schemas/todo.schemas.js";

const router = Router();

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Créer un todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       201:
 *         description: Todo créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       422:
 *         description: Champ requis manquant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /todos
router.post("/", async (req, res) => {
  try {
    Sentry.logger.info("POST /todos create", { path: "/todos", method: "POST" });
    const parsed = validate(todoInput, req.body);
    if (!parsed.success) return res.status(422).json({ detail: parsed.error.message });
    const { title, description, status } = parsed.data;
    const db = await getDb();
    db.run("INSERT INTO todos (title, description, status) VALUES (?, ?, ?)", [title, description ?? null, status]);
    const id = db.exec("SELECT last_insert_rowid() as id")[0].values[0][0];
    const row = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
    saveDb();
    const todo = toObj(row);
    res.status(201).json(todo);
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Récupérer tous les todos
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Nombre d'éléments à ignorer (pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre maximum d'éléments à retourner
 *     responses:
 *       200:
 *         description: Liste des todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
// GET /todos
router.get("/", async (req, res) => {
  try {
    Sentry.logger.info("GET /todos list", { path: "/todos", method: "GET" });
    const parsed = validate(queryList, req.query);
    if (!parsed.success) return res.status(422).json({ detail: parsed.error.message });
    const { skip, limit } = parsed.data;
    const db = await getDb();
    const rows = db.exec("SELECT * FROM todos LIMIT ? OFFSET ?", [limit, skip]);
    const x = toArray(rows);
    res.json(x);
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

/**
 * @swagger
 * /todos/search/all:
 *   get:
 *     summary: Rechercher les todos par titre
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           default: ""
 *         description: Chaîne de recherche dans le titre
 *     responses:
 *       200:
 *         description: Liste des todos correspondants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get("/search/all", async (req, res) => {
  try {
    Sentry.logger.info("GET /todos/search/all", { path: "/todos/search/all", method: "GET" });
    const parsed = validate(querySearch, req.query);
    if (!parsed.success) return res.status(422).json({ detail: parsed.error.message });
    const { q } = parsed.data;
    const db = await getDb();
    const results = db.exec("SELECT * FROM todos WHERE title LIKE ?", [`%${q}%`]);
    res.json(toArray(results));
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Récupérer un todo par ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du todo
 *     responses:
 *       200:
 *         description: Todo trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /todos/:id
router.get("/:id", async (req, res) => {
  try {
    Sentry.logger.info("GET /todos/:id", { path: "/todos", method: "GET", id: req.params.id });
    const parsed = validate(paramsId, req.params);
    if (!parsed.success) return res.status(422).json({ detail: parsed.error.message });
    const { id } = parsed.data;
    const db = await getDb();
    const rows = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
    if (!rows.length || !rows[0].values.length) return res.status(404).json({ detail: "Todo not found" });
    res.json(toObj(rows));
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Mettre à jour un todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du todo
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoInput'
 *     responses:
 *       200:
 *         description: Todo mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /todos/:id
router.put("/:id", async (req, res) => {
  try {
    Sentry.logger.info("PUT /todos/:id", { path: "/todos", method: "PUT", id: req.params.id });
    const paramsParsed = validate(paramsId, req.params);
    if (!paramsParsed.success) return res.status(422).json({ detail: paramsParsed.error.message });
    const { id } = paramsParsed.data;

    const bodyParsed = validate(todoInputPartial, req.body);
    if (!bodyParsed.success) return res.status(422).json({ detail: bodyParsed.error.message });

    const db = await getDb();
    const existing = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
    if (!existing.length || !existing[0].values.length) return res.status(404).json({ detail: "Todo not found" });

    const old = toObj(existing);
    const title = bodyParsed.data.title ?? old.title;
    const description = bodyParsed.data.description !== undefined ? bodyParsed.data.description : old.description;
    const status = bodyParsed.data.status ?? old.status;

    db.run("UPDATE todos SET title = ?, description = ?, status = ? WHERE id = ?", [title, description, status, id]);
    const rows = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
    saveDb();
    res.json(toObj(rows));
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Supprimer un todo
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du todo
 *     responses:
 *       200:
 *         description: Todo supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detail:
 *                   type: string
 *                   example: "Todo deleted"
 *       404:
 *         description: Todo non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /todos/:id
router.delete("/:id", async (req, res) => {
  try {
    Sentry.logger.info("DELETE /todos/:id", { path: "/todos", method: "DELETE", id: req.params.id });
    const parsed = validate(paramsId, req.params);
    if (!parsed.success) return res.status(422).json({ detail: parsed.error.message });
    const { id } = parsed.data;
    const db = await getDb();
    const existing = db.exec("SELECT * FROM todos WHERE id = ?", [id]);
    if (!existing.length || !existing[0].values.length) return res.status(404).json({ detail: "Todo not found" });
    db.run("DELETE FROM todos WHERE id = ?", [id]);
    saveDb();
    res.json({ detail: "Todo deleted" });
  } catch (err) {
    Sentry.captureException(err);
    res.status(500).json({ detail: err.message || "Internal server error" });
  }
});

export default router;
