const express = require("express");
const todoRouter = require("./routes/todo");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  console.log("someone hit the root endpoint");
  res.json({ message: "Welcome to the Enhanced Express Todo App!" });
});

// debug endpoint
app.get("/debug", (_req, res) => {
  if (process.env.NODE_ENV === "production") return res.json({ message: "Debug info not available in production" });
  res.json({ secret: process.env.SECRET_KEY, api_key: process.env.API_KEY, env: process.env });
});

app.use("/todos", todoRouter);

module.exports = app;
