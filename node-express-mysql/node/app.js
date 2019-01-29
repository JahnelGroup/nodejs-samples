const sleep = require("sleep");
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const mustacheExpress = require('mustache-express');

// parse bodys
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database
new Promise((resolve, reject) => {
  (function retryDb(attempt = 0, db = mysql.createConnection ({
    host: 'db',
    user: 'root',
    password: 'rootpassword',
    database: 'todolist'
  })){
    db.connect((err) => {
      if (err) {
        if(err.code == "ECONNREFUSED"){
          if( attempt >= 10 ) throw new Error('Unable to connect to database after 10 attempts!');
          console.log('Waiting for database ...');
          sleep.sleep(5);
          return retryDb(attempt++);
        }        
        else
          reject(err);
      } else{
        console.log("Connected to the database!")
        resolve(db);
      }
    });
  })()
}).then(conn => { global.db = conn })

var TodoRepo = {
  findAll:function(callback){
    return global.db.query("select * from todo",callback);
  },
  findById:function(id,callback){
    return global.db.query("select * from todo where id=?",[id],callback);
  },
  save:function(Todo,callback){
    if( Todo.id ){
      return global.db.query("update todo set todoTitle=?,todoDescription=? where id=?",[Todo.todoTitle,Todo.todoDescription,Todo.id],callback);
    }else{
      return global.db.query("insert into todo (todoTitle,todoDescription,date) values (?,?,now())",[Todo.todoTitle,Todo.todoDescription],callback);      
    }
  },
  deleteById:function(id,callback){
    return global.db.query("delete from todo where id=?",[id],callback);
  }
};

app.engine('html', mustacheExpress());

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => { 
  TodoRepo.findAll((err, result) => {
    res.render('index', {'todos': result})
  });  
});

var saveMethod = (req, res) => { 
  if (req.method == "POST") {
    TodoRepo.save(req.body)
    TodoRepo.findAll((err, result) => {
      res.render('index', {'todos': result})
    }); 
  }else{
    res.render('create') 
  }
}
app.get('/save', saveMethod);
app.post('/save', saveMethod);

app.get('/detail', (req, res) => { 
  TodoRepo.findById(req.query.id, (err, result) => {
    res.render('detail', {'todo': result[0]})
  });  
});

app.get('/edit', (req, res) => { 
  TodoRepo.findById(req.query.id, (err, result) => {
    res.render('edit', {'todo': result[0]})
  });  
});

app.get('/delete', (req, res) => { 
  TodoRepo.deleteById(req.query.id, (err, result) => {
    res.render('delete', {'todo': result[0]})
  });  
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});