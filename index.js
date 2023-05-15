const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
const PORT = 3000;
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH")
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
let todos = [];
app.get("/", (req, res) => {
  return res.json({ message: "Getting API successfully", status: 200 });
});

app.get("/getTasks", (req, res) => {
  return res.json({
    message: "Getting tasks successfully",
    status: 200,
    todos,
  });
});

app.post("/addTasks", (req, res) => {
  let { id, task, assignee, isDone } = req.body;
  todos.push({ id, task, assignee, isDone });
  return res.json({ message: "Task Added successfully", status: 200 });
});
app.delete("/deleteTask/:id", (req, res) => {
  let { id } = req.params;
  let _todos = todos.filter((todo) => todo.id !== id);
  todos = [..._todos];
  return res.json({ message: "Task deleted successfully", status: 200 });
});
app.patch("/changedoneState/:id", (req, res) => {
  let { id } = req.params;
  let { isDone } = req.body;
  let _todos = todos.map((todo) => {
    if (todo.id === id) return { ...todo, isDone: !isDone };
    else return todo;
  });
  todos = [..._todos];
  return res.json({message: "Changing done state successfully", status: 200});
});
app.patch("/editTask/:id", (req, res) => {
  let { id } = req.params;
  let { task } = req.body;
  let _todos = todos.map((todo) => {
    if (todo.id === id) return { ...todo, task };
    else return todo;
  });
  todos = [..._todos];
  return res.json({message: "Changing done state successfully", status: 200});
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
