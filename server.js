// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// "database" trong bộ nhớ
let todos = [];
let currentId = 1;

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json(todo);
});


// Thêm todo mới
app.post("/todos", (req, res) => {
  const { text, deadline } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const todo = {
    id: currentId++,
    text,
    done: false,
    deadline: deadline || null,
  };
  todos.push(todo);
  res.json(todo);
});

// Cập nhật todo
app.patch("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { text, done, deadline } = req.body;
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "Not found" });

  if (text !== undefined) todo.text = text;
  if (done !== undefined) todo.done = done; // <- quan trọng
  if (deadline !== undefined) todo.deadline = deadline;

  res.json(todo);
});


// Xóa todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.status(204).end();
});

// Xóa tất cả todo đã hoàn thành
app.delete("/todos", (req, res) => {
  todos = todos.filter(t => !t.done);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Todo API running at http://localhost:${PORT}`);
});
