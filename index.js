const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const app = express();
app.use(express.json())
const PORT = 3000;
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'todolist',
// });

var db_config = {
  host: 'localhost',
    user: 'root',
    database: 'todolist',
    _socket:"/tmp/mysql.sock"
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();








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