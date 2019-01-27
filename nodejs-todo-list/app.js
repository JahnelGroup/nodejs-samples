const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const mustacheExpress = require('mustache-express');

// parse bodys
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connection to the database
const db = mysql.createConnection ({
  host: '127.0.0.1',
  user: 'root',
  password: 'rootpassword',
  database: 'todolist'
});

// connect to database
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});
global.db = db;

var TodoRepo = {
  findAll:function(callback){
    return db.query("select * from todo",callback);
  },
  findById:function(id,callback){
    return db.query("select * from todo where id=?",[id],callback);
  },
  save:function(Todo,callback){
    if( Todo.id ){
      return db.query("update todo set todoTitle=?,todoDescription=? where id=?",[Todo.todoTitle,Todo.todoDescription,Todo.id],callback);
    }else{
      return db.query("insert into todo (todoTitle,todoDescription,date) values (?,?,now())",[Todo.todoTitle,Todo.todoDescription],callback);      
    }
  },
  deleteById:function(id,callback){
    return db.query("delete from todo where id=?",[id],callback);
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