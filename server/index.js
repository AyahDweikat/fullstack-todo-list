const express = require("express");
// const path = require('path')
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json())
const PORT = 3000;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'todolist'
});
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', '*');
  res.header("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS, DELETE, PATCH")
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// serve up production assets
app.use(express.static('client/build'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
const path = require('path');
app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});




// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../client/build')));


// All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });



app.get("/getTasks", (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
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