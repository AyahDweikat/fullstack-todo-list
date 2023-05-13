const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json())
const PORT = 3000;
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  database: 'todolist',
  port:"3001"
});
app.use((_req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', '*');
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH")
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
  return res.json({ message: "Getting API successfully", status:200});
});

app.get("/getTasks", (req, res) => {
  let sql = `SELECT * FROM todos`;
    connection.execute(sql, (err, result)=>{
        if(err){
            return res.json({message:'error in sql', err})
        }
        return res.json({ message: "Getting tasks successfully", status:200, todos:result });
    })
});
app.post("/addTasks", (req, res) => {
  let {id, task, assignee, isDone} = req.body;
    let sql = `INSERT INTO todos(id, task, assignee, isDone) VALUES ('${id}','${task}','${assignee}', ${isDone})`
    connection.execute(sql, (err, result)=>{
        if(err){
            return res.json({message:'error in sql', err})
        }
        return res.json({ message: "Task Added successfully",status:200, result });
    })
});
app.delete("/deleteTask/:id", (req, res) => {
  console.log(req.params)
  let {id} = req.params;
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');


    let sql = `DELETE FROM todos WHERE id ='${id}'`
    connection.execute(sql, (err, result)=>{
        if(err){
            return res.json({message:'error in sql', err})
        }
        if(result.affectedRows == 0) return res.json({message:'User not found'})
        return res.json({message:'Task deleted successfully', status:200, result})
    })
});
app.patch("/changedoneState/:id", (req, res) => {
  let {id} = req.params;
    let {isDone}= req.body; 
    let sql =`UPDATE todos SET isDone=${isDone} WHERE id='${id}'`;
    connection.execute(sql, (err, result)=>{
        if(err){
            return res.json({message:'error in sql', err})
        }
        return res.json({message:'Changing done state successfully', status:200, result})
    })
});
app.patch("/editTask/:id", (req, res) => {
  let {id} = req.params;
    let {task}= req.body; 
    let sql =`UPDATE todos SET task='${task}' WHERE id='${id}'`;
    connection.execute(sql, (err, result)=>{
        if(err){
            return res.json({message:'error in sql', err})
        }
        return res.json({message:'Task edited successfully', status:200, result})
    })
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});